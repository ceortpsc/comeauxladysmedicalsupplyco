import { NextRequest, NextResponse } from "next/server";
import { processForm } from "@comeaux/data-entry";

export async function POST(request:NextRequest){
  try{
    const body=await request.json();
    if(!body || typeof body.formId!=="string" || !body.values || typeof body.values!=="object"){
      return NextResponse.json({ok:false,error:"formId and values are required."},{status:400});
    }
    const result=processForm(body.formId,body.values,body.includeAiAssist!==false);
    return NextResponse.json({ok:true,result});
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Unable to process form."},{status:400});
  }
}
