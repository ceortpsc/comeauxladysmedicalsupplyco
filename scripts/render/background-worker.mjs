import { createClient } from "redis";
import { generateTheme } from "./theme-engine.mjs";

const redisUrl=process.env.REDIS_URL;
if(!redisUrl){console.error("REDIS_URL is required for runtime worker");process.exit(1);}

const queue=process.env.RUNTIME_QUEUE||"comeaux:jobs";
const resultList=process.env.RUNTIME_RESULTS||"comeaux:job-results";
const themeKey=process.env.CURRENT_THEME_KEY||"comeaux:theme:current";
let running=true;

const client=createClient({url:redisUrl});
client.on("error",err=>console.error("redis_error",{message:err.message}));

async function processJob(raw){
  let job;
  try{job=JSON.parse(raw);}catch{return {ok:false,error:"invalid_json"};}
  const startedAt=new Date().toISOString();
  if(job.type==="theme.generate"){
    const theme=generateTheme({signals:Array.isArray(job.signals)?job.signals:[]});
    await client.set(themeKey,JSON.stringify(theme),{EX:3600});
    return {ok:true,type:job.type,jobId:job.id||null,startedAt,finishedAt:new Date().toISOString(),themeId:theme.id};
  }
  if(job.type==="runtime.heartbeat"){
    const heartbeat={ok:true,type:job.type,jobId:job.id||null,startedAt,finishedAt:new Date().toISOString()};
    await client.set("comeaux:worker:heartbeat",JSON.stringify(heartbeat),{EX:300});
    return heartbeat;
  }
  return {ok:false,type:job.type||"unknown",jobId:job.id||null,error:"unsupported_job_type",startedAt,finishedAt:new Date().toISOString()};
}

async function shutdown(signal){
  running=false;
  console.log("shutdown_requested",{signal});
  try{if(client.isOpen)await client.quit();}finally{process.exit(0);}
}
process.on("SIGTERM",()=>shutdown("SIGTERM"));
process.on("SIGINT",()=>shutdown("SIGINT"));

await client.connect();
console.log("worker_ready",{queue});
while(running){
  try{
    const item=await client.blPop(queue,5);
    if(!item)continue;
    const result=await processJob(item.element);
    await client.lPush(resultList,JSON.stringify(result));
    await client.lTrim(resultList,0,199);
    console.log("job_processed",result);
  }catch(err){
    if(!running)break;
    console.error("worker_loop_error",{message:err instanceof Error?err.message:String(err)});
    await new Promise(resolve=>setTimeout(resolve,1000));
  }
}
