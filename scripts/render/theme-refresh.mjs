import { randomUUID } from "node:crypto";
import { createClient } from "redis";

const redisUrl=process.env.REDIS_URL;
if(!redisUrl){console.error("REDIS_URL is required");process.exit(1);}
const queue=process.env.RUNTIME_QUEUE||"comeaux:jobs";
const configured=(process.env.TREND_SIGNALS||"").split(",").map(x=>x.trim()).filter(Boolean).slice(0,8);
const client=createClient({url:redisUrl});
client.on("error",err=>console.error("redis_error",{message:err.message}));
await client.connect();
const job={id:randomUUID(),type:"theme.generate",signals:configured,requestedAt:new Date().toISOString(),source:"render-cron"};
await client.rPush(queue,JSON.stringify(job));
console.log(JSON.stringify({ok:true,queued:true,queue,jobId:job.id,signalCount:configured.length}));
await client.quit();
