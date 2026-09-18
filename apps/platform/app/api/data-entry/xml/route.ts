import { NextRequest, NextResponse } from "next/server";
import { exportFormXml, importFormXml } from "@comeaux/data-entry";

export async function POST(request:NextRequest){
  try{
    const body=await request.json();
    if(body?.mode==="export"){
      const xml=exportFormXml(String(body.formId||""),body.values||{});
      return new NextResponse(xml,{status:200,headers:{"content-type":"application/xml; charset=utf-8","cache-control":"no-store"}});
    }
    if(body?.mode==="import"){
      const result=importFormXml(String(body.xml||""));
      return NextResponse.json({ok:true,result});
    }
    return NextResponse.json({ok:false,error:"mode must be export or import."},{status:400});
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof Error?error.message:"XML conversion failed."},{status:400});
  }
}
