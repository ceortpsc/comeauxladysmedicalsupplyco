import { NextResponse } from "next/server";
import { createClient } from "redis";

export const runtime="nodejs";
export const dynamic="force-dynamic";

const fallback={
  id:"theme-fallback",
  title:"Care Team Readiness",
  slug:"care-team-readiness",
  sourceMode:"calendar_rules",
  signals:[],
  focus:["clinical readiness","LTC support","training"],
  palette:{name:"Care Team Purple",primary:"#32113F",accent:"#EC4FA0",background:"#FFFFFF"},
  disclosure:"Fallback theme. It is not a claim of live internet trend data."
};

export async function GET(){
  const url=process.env.REDIS_URL;
  if(!url)return NextResponse.json({ok:true,source:"fallback",theme:fallback});
  const client=createClient({url});
  client.on("error",()=>{});
  try{
    await client.connect();
    const raw=await client.get(process.env.CURRENT_THEME_KEY||"comeaux:theme:current");
    if(!raw)return NextResponse.json({ok:true,source:"fallback",theme:fallback});
    return NextResponse.json({ok:true,source:"key_value",theme:JSON.parse(raw)});
  }catch{
    return NextResponse.json({ok:true,source:"fallback",theme:fallback,degraded:true});
  }finally{
    if(client.isOpen)await client.quit();
  }
}
