import { createClient } from "redis";
import { createHash, randomUUID } from "node:crypto";
import { generateTheme } from "./theme-engine.mjs";

const redisUrl=process.env.REDIS_URL;
if(!redisUrl){console.error("REDIS_URL is required for runtime worker");process.exit(1);}

const queue=process.env.RUNTIME_QUEUE||"comeaux:jobs";
const resultList=process.env.RUNTIME_RESULTS||"comeaux:job-results";
const deadLetter=process.env.RUNTIME_DLQ||"comeaux:jobs:dead-letter";
const themeKey=process.env.CURRENT_THEME_KEY||"comeaux:theme:current";
const artifactList=process.env.ARTIFACT_REGISTRY_KEY||"comeaux:artifacts";
let running=true;
let activeJob=null;

const client=createClient({url:redisUrl});
client.on("error",err=>console.error("redis_error",{message:err.message}));

const now=()=>new Date().toISOString();
const checksum=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");

function envelope(job,startedAt,extra={}){
  return {
    ok:true,
    type:job.type,
    jobId:job.id||randomUUID(),
    startedAt,
    finishedAt:now(),
    ...extra
  };
}

async function handleTheme(job,startedAt){
  const theme=generateTheme({signals:Array.isArray(job.signals)?job.signals:[]});
  await client.set(themeKey,JSON.stringify(theme),{EX:3600});
  return envelope(job,startedAt,{status:"completed",themeId:theme.id});
}

async function handleHeartbeat(job,startedAt){
  const result=envelope(job,startedAt,{status:"completed",worker:{pid:process.pid,queue}});
  await client.set("comeaux:worker:heartbeat",JSON.stringify(result),{EX:300});
  return result;
}

async function handleArtifactRegistration(job,startedAt){
  const artifact={
    id:job.payload?.id||randomUUID(),
    type:job.payload?.type||"unspecified",
    source:job.payload?.source||"runtime",
    version:job.payload?.version||process.env.APP_VERSION||"0.0.0",
    commit:job.payload?.commit||process.env.RENDER_GIT_COMMIT||"unknown",
    checksum:job.payload?.checksum||checksum(job.payload||{}),
    registeredAt:now(),
    immutable:job.payload?.immutable!==false
  };
  await client.lPush(artifactList,JSON.stringify(artifact));
  await client.lTrim(artifactList,0,499);
  return envelope(job,startedAt,{status:"completed",artifact});
}

async function handleReleaseEvidence(job,startedAt){
  const evidence={
    id:job.payload?.id||randomUUID(),
    commit:job.payload?.commit||process.env.RENDER_GIT_COMMIT||"unknown",
    environment:process.env.APP_ENV||"unknown",
    version:process.env.APP_VERSION||"unknown",
    health:job.payload?.health||"unverified",
    build:job.payload?.build||"unverified",
    capturedAt:now()
  };
  await client.lPush("comeaux:release-evidence",JSON.stringify(evidence));
  await client.lTrim("comeaux:release-evidence",0,199);
  return envelope(job,startedAt,{status:"completed",evidence});
}

async function handleAuditSnapshot(job,startedAt){
  const [queueDepth,resultDepth,artifactDepth]=await Promise.all([
    client.lLen(queue),client.lLen(resultList),client.lLen(artifactList)
  ]);
  const snapshot={queueDepth,resultDepth,artifactDepth,capturedAt:now()};
  await client.set("comeaux:audit:latest",JSON.stringify(snapshot),{EX:86400});
  return envelope(job,startedAt,{status:"completed",snapshot});
}

async function handleNotification(job,startedAt){
  const provider=process.env.NOTIFICATION_PROVIDER||"";
  if(!provider){
    return envelope(job,startedAt,{status:"blocked_missing_provider",actionTaken:false,reason:"No verified notification provider configured"});
  }
  return envelope(job,startedAt,{status:"prepared_for_provider",actionTaken:false,provider,reason:"Provider adapter must perform and confirm delivery"});
}

async function handleInvoiceRender(job,startedAt){
  const invoiceId=job.payload?.invoiceId||null;
  if(!invoiceId)return {...envelope(job,startedAt),ok:false,status:"rejected",reason:"invoiceId is required"};
  const renderRequest={invoiceId,format:"pdf",status:"queued_for_renderer",createdAt:now()};
  await client.lPush("comeaux:publishing:invoice",JSON.stringify(renderRequest));
  return envelope(job,startedAt,{status:"prepared_for_renderer",renderRequest});
}

async function handleLmsProgress(job,startedAt){
  const attempts=Array.isArray(job.payload?.attempts)?job.payload.attempts:[];
  const completed=attempts.filter(x=>x?.completed===true).length;
  const percent=attempts.length===0?0:Math.round((completed/attempts.length)*100);
  return envelope(job,startedAt,{status:"completed",progress:{completed,total:attempts.length,percent},credentialIssued:false});
}

async function handleHumanReview(job,startedAt,kind){
  const review={
    id:randomUUID(),
    kind,
    status:"prepared_for_review",
    externalSubmission:false,
    approvalRequired:true,
    payload:job.payload||{},
    preparedAt:now()
  };
  await client.lPush(`comeaux:review:${kind}`,JSON.stringify(review));
  return envelope(job,startedAt,{status:"prepared_for_review",review});
}

async function handleExternalHandoff(job,startedAt,system){
  const packet={
    id:randomUUID(),
    system,
    status:"ready_for_external_handoff",
    submitted:false,
    accepted:false,
    payloadHash:checksum(job.payload||{}),
    preparedAt:now()
  };
  await client.lPush(`comeaux:handoff:${system}`,JSON.stringify(packet));
  return envelope(job,startedAt,{status:"ready_for_external_handoff",packet});
}

async function handlePaymentReconcile(job,startedAt){
  const signatureVerified=job.payload?.signatureVerified===true;
  if(!signatureVerified){
    return {...envelope(job,startedAt),ok:false,status:"rejected",reason:"Signed provider event required"};
  }
  return envelope(job,startedAt,{status:"prepared_for_reconciliation",settlementClaimed:false});
}

async function processJob(raw){
  let job;
  try{job=JSON.parse(raw);}catch{return {ok:false,status:"rejected",error:"invalid_json",finishedAt:now()};}
  const startedAt=now();
  activeJob=job.id||job.type||"unknown";
  try{
    switch(job.type){
      case "theme.generate": return await handleTheme(job,startedAt);
      case "runtime.heartbeat": return await handleHeartbeat(job,startedAt);
      case "artifact.register": return await handleArtifactRegistration(job,startedAt);
      case "deployment.evidence.capture": return await handleReleaseEvidence(job,startedAt);
      case "audit.snapshot": return await handleAuditSnapshot(job,startedAt);
      case "notification.dispatch": return await handleNotification(job,startedAt);
      case "invoice.render.request": return await handleInvoiceRender(job,startedAt);
      case "lms.progress.recalculate": return await handleLmsProgress(job,startedAt);
      case "credential.revalidation.prepare": return await handleHumanReview(job,startedAt,"credential-revalidation");
      case "regulatory.packet.prepare": return await handleHumanReview(job,startedAt,"regulatory-packet");
      case "certificate.record.prepare": return await handleHumanReview(job,startedAt,"certificate-record");
      case "inventory.reorder.review": return await handleHumanReview(job,startedAt,"inventory-reorder");
      case "business_filing.packet.prepare": return await handleExternalHandoff(job,startedAt,job.payload?.system||"official-state-portal");
      case "payment.reconcile": return await handlePaymentReconcile(job,startedAt);
      default:
        return {ok:false,type:job.type||"unknown",jobId:job.id||null,status:"unsupported_job_type",startedAt,finishedAt:now()};
    }
  }finally{
    activeJob=null;
  }
}

async function shutdown(signal){
  running=false;
  console.log("shutdown_requested",{signal,activeJob});
  const deadline=Date.now()+55000;
  while(activeJob && Date.now()<deadline){await new Promise(resolve=>setTimeout(resolve,250));}
  try{if(client.isOpen)await client.quit();}finally{process.exit(0);}
}
process.on("SIGTERM",()=>shutdown("SIGTERM"));
process.on("SIGINT",()=>shutdown("SIGINT"));

await client.connect();
console.log("worker_ready",{queue,pid:process.pid});
while(running){
  try{
    const item=await client.blPop(queue,5);
    if(!item)continue;
    const result=await processJob(item.element);
    await client.lPush(resultList,JSON.stringify(result));
    await client.lTrim(resultList,0,499);
    if(result.ok===false){await client.lPush(deadLetter,JSON.stringify({raw:item.element,result}));await client.lTrim(deadLetter,0,199);}
    console.log("job_processed",{type:result.type,status:result.status,jobId:result.jobId});
  }catch(err){
    if(!running)break;
    console.error("worker_loop_error",{message:err instanceof Error?err.message:String(err)});
    await new Promise(resolve=>setTimeout(resolve,1000));
  }
}
