import { NextRequest, NextResponse } from "next/server";
import { prepareExternalEnvelope, type ExternalAction } from "@comeaux/external-gateway";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIONS = new Set<ExternalAction>(["prepare", "handoff", "submit", "verify", "reconcile", "charge"]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || typeof body.adapterId !== "string" || !ACTIONS.has(body.action)) {
      return NextResponse.json({ok:false,error:"invalid_request",message:"adapterId and a supported action are required"},{status:400});
    }
    if (!body.payload || typeof body.payload !== "object" || Array.isArray(body.payload)) {
      return NextResponse.json({ok:false,error:"invalid_payload",message:"payload must be an object"},{status:400});
    }

    const envelope = prepareExternalEnvelope({
      adapterId: body.adapterId,
      action: body.action,
      actorRole: typeof body.actorRole === "string" ? body.actorRole : "customer",
      payload: body.payload,
      zeroCostOnly: true
    });

    const status = envelope.state.startsWith("blocked_") ? 422 : 200;
    return NextResponse.json({ok:status===200,envelope},{status});
  } catch (error) {
    return NextResponse.json({
      ok:false,
      error:"preparation_failed",
      message:error instanceof Error ? error.message : "Unknown error"
    },{status:400});
  }
}
