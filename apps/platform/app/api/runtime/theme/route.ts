import { NextResponse } from "next/server";
import { createClient } from "redis";
import { generateRuntimeTheme } from "../../../../lib/runtime-theme";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(){
  const configuredSignals=(process.env.TREND_SIGNALS||"").split(",").map(x=>x.trim()).filter(Boolean).slice(0,8);
  const generated=generateRuntimeTheme(configuredSignals);
  const url=process.env.REDIS_URL;
  if(!url)return NextResponse.json({ok:true,source:"generated_local",theme:generated});

  const client=createClient({url});
  client.on("error",()=>{});
  try{
    await client.connect();
    const key=process.env.CURRENT_THEME_KEY||"comeaux:theme:current";
    const raw=await client.get(key);
    if(raw)return NextResponse.json({ok:true,source:"key_value",theme:JSON.parse(raw)});
    await client.set(key,JSON.stringify(generated),{EX:3600});
    return NextResponse.json({ok:true,source:"generated_and_cached",theme:generated});
  }catch{
    return NextResponse.json({ok:true,source:"generated_local",theme:generated,degraded:true});
  }finally{
    if(client.isOpen)await client.quit();
  }
}
