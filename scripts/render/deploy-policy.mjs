const env=process.env.APP_ENV||"development";
const branch=process.env.GIT_BRANCH||process.env.RENDER_GIT_BRANCH||"unknown";
const production=env==="production"||branch==="main";
const allow=process.env.ALLOW_PRODUCTION_DEPLOY==="YES";
const required=["RENDER_SERVICE_ID"];
const missing=required.filter(k=>!process.env[k]);
const report={ok:missing.length===0 && (!production||allow),environment:env,branch,production,productionApproved:allow,missing,checkedAt:new Date().toISOString()};
console.log(JSON.stringify(report,null,2));
if(missing.length)process.exit(2);
if(production&&!allow){console.error("Production deploy blocked: set ALLOW_PRODUCTION_DEPLOY=YES after explicit approval.");process.exit(3);}
