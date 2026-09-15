import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(()=>null);
  if (!body || typeof body.envelopeId !== "string" || typeof body.reportedStatus !== "string") {
    return NextResponse.json({ok:false,error:"invalid_request",message:"envelopeId and reportedStatus are required"},{status:400});
  }

  const record = {
    envelopeId:body.envelopeId,
    reportedStatus:body.reportedStatus,
    externalReference:typeof body.externalReference === "string" ? body.externalReference : null,
    evidenceDescription:typeof body.evidenceDescription === "string" ? body.evidenceDescription : null,
    recordedAt:new Date().toISOString(),
    verificationState:"user_supplied_unverified",
    officialAcceptance:false,
    disclosure:"This record captures user-supplied external evidence. It is not an independent verification of submission, acceptance, approval, payment, licensure, credential status, or delivery."
  };

  if (!process.env.REDIS_URL) {
    return NextResponse.json({ok:true,record,persistence:{persisted:false,store:"none"}});
  }

  const client=createClient({url:process.env.REDIS_URL});
  client.on("error",()=>{});
  try {
    await client.connect();
    await client.set(`comeaux:external-evidence:${body.envelopeId}`,JSON.stringify(record),{EX:604800});
    return NextResponse.json({ok:true,record,persistence:{persisted:true,store:"render-key-value-ephemeral",ttlSeconds:604800}});
  } catch {
    return NextResponse.json({ok:true,record,persistence:{persisted:false,store:"unavailable"}});
  } finally {
    if(client.isOpen) await client.quit();
  }
}
