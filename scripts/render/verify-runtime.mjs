const base=(process.env.BASE_URL||process.argv[2]||"").replace(/\/$/,"");
if(!base){console.error("BASE_URL or first argument is required");process.exit(2);}
const checks=["/api/health","/api/runtime/evidence","/api/runtime/theme"];
let failed=0;
for(const path of checks){
  const started=Date.now();
  try{
    const res=await fetch(base+path,{headers:{"user-agent":"comeaux-runtime-verifier/1.0"}});
    const text=await res.text();
    let body;try{body=JSON.parse(text);}catch{body={raw:text.slice(0,300)};}
    const ok=res.ok && body?.ok!==false;
    if(!ok)failed++;
    console.log(JSON.stringify({path,status:res.status,ok,durationMs:Date.now()-started,body}));
  }catch(err){
    failed++;
    console.error(JSON.stringify({path,ok:false,durationMs:Date.now()-started,error:err instanceof Error?err.message:String(err)}));
  }
}
if(failed){console.error(JSON.stringify({ok:false,failed,total:checks.length}));process.exit(1);}
console.log(JSON.stringify({ok:true,failed:0,total:checks.length,verifiedAt:new Date().toISOString()}));
