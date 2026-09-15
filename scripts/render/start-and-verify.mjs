import {spawn} from "node:child_process";

const port=process.env.PORT||"10000";
const base=`http://127.0.0.1:${port}`;
const child=spawn("npm",["--workspace","@comeaux/platform","run","start"],{stdio:"inherit",env:process.env});
let stopping=false;

function stop(signal="SIGTERM"){
  if(stopping)return;
  stopping=true;
  child.kill(signal);
}
process.on("SIGTERM",()=>stop("SIGTERM"));
process.on("SIGINT",()=>stop("SIGINT"));
child.on("exit",code=>process.exit(code??0));

async function getJson(path){
  const res=await fetch(base+path,{cache:"no-store"});
  const body=await res.json();
  if(!res.ok||body?.ok===false)throw new Error(`${path} failed with ${res.status}`);
  return body;
}

async function waitForHealth(){
  const deadline=Date.now()+45000;
  let lastError="not started";
  while(Date.now()<deadline){
    try{return await getJson("/api/health");}
    catch(err){lastError=err instanceof Error?err.message:String(err);await new Promise(r=>setTimeout(r,750));}
  }
  throw new Error(`health timeout: ${lastError}`);
}

try{
  const health=await waitForHealth();
  const evidence=await getJson("/api/runtime/evidence");
  const theme=await getJson("/api/runtime/theme");
  if(process.env.REDIS_URL && theme.degraded===true)throw new Error("Key Value configured but runtime theme route is degraded");
  console.log("RUNTIME_SELF_TEST_OK",JSON.stringify({
    health:{service:health.service,version:health.version,environment:health.environment},
    evidence:{dependencies:evidence.dependencies,release:evidence.release},
    theme:{source:theme.source,degraded:theme.degraded===true},
    verifiedAt:new Date().toISOString()
  }));
}catch(err){
  console.error("RUNTIME_SELF_TEST_FAILED",{message:err instanceof Error?err.message:String(err)});
  stop("SIGTERM");
  setTimeout(()=>process.exit(1),1500).unref();
}
