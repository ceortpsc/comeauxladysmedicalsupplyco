import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { processForm } from "@comeaux/data-entry";

export async function POST(request:NextRequest){
  try{
    const body=await request.json();
    const validation=processForm("customer-contact",body?.values||{},true);
    if(!validation.valid) return NextResponse.json({ok:false,state:"blocked_validation",validation},{status:400});
    return NextResponse.json({
      ok:true,
      state:"prepared_unpersisted",
      caseId:`CONTACT-${randomUUID().slice(0,8).toUpperCase()}`,
      validation,
      delivery:{
        configured:false,
        delivered:false,
        message:"No outbound email/ticket provider is configured in the $0 preview. This creates a validated contact packet only."
      }
    });
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Unable to prepare contact request."},{status:400});
  }
}
