import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";
import { prepareExternalEnvelope } from "@comeaux/external-gateway";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function emailHandoff(payload: Record<string, unknown>) {
  const recipient = typeof payload.recipient === "string" ? payload.recipient : "";
  const subject = typeof payload.subject === "string" ? payload.subject : "";
  const body = typeof payload.body === "string" ? payload.body : "";
  return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function persistEnvelope(envelope: ReturnType<typeof prepareExternalEnvelope>) {
  if (!process.env.REDIS_URL) return {persisted:false,store:"none" as const};
  const client = createClient({url:process.env.REDIS_URL});
  client.on("error",()=>{});
  try {
    await client.connect();
    const key = `comeaux:external-envelope:${envelope.envelopeId}`;
    await client.set(key, JSON.stringify(envelope), {EX:86400});
    return {persisted:true,store:"render-key-value-ephemeral" as const,ttlSeconds:86400};
  } catch {
    return {persisted:false,store:"unavailable" as const};
  } finally {
    if (client.isOpen) await client.quit();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const envelope = prepareExternalEnvelope({
      adapterId: body.adapterId,
      action: "handoff",
      actorRole: typeof body.actorRole === "string" ? body.actorRole : "customer",
      payload: body.payload && typeof body.payload === "object" && !Array.isArray(body.payload) ? body.payload : {},
      zeroCostOnly: true
    });

    if (envelope.state !== "ready_for_handoff") {
      return NextResponse.json({ok:false,envelope},{status:422});
    }

    const target = envelope.adapterId === "email-client-handoff"
      ? emailHandoff(envelope.sanitizedPayload)
      : envelope.officialUrl;
    const persistence = await persistEnvelope(envelope);

    return NextResponse.json({
      ok:true,
      handoff:{
        envelopeId:envelope.envelopeId,
        target,
        evidenceHash:envelope.evidenceHash,
        state:envelope.state,
        directWritePerformed:false,
        submitted:false,
        accepted:false,
        paid:false,
        persistence,
        disclosure:envelope.disclosure,
        nextAction:envelope.nextAction
      }
    });
  } catch (error) {
    return NextResponse.json({ok:false,error:"handoff_failed",message:error instanceof Error?error.message:"Unknown error"},{status:400});
  }
}
