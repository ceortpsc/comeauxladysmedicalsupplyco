import { NextRequest, NextResponse } from "next/server";
import { respondAsAndreaa } from "@comeaux/ai-core";

export async function POST(request:NextRequest){
  try{
    const body=await request.json();
    const message=typeof body?.message==="string"?body.message.trim():"";
    if(!message) return NextResponse.json({ok:false,error:"message is required."},{status:400});
    if(message.length>4000) return NextResponse.json({ok:false,error:"message is too long."},{status:400});
    return NextResponse.json({ok:true,reply:respondAsAndreaa(message)});
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Unable to process support request."},{status:400});
  }
}
