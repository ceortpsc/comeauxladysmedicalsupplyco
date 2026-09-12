import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { COLORADO_SOS, validateColoradoLLCDraft, type ColoradoLLCDraft } from "../../../../../../lib/colorado-business";

export async function POST(request: Request) {
  let draft: ColoradoLLCDraft;
  try {
    draft = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  const issues = validateColoradoLLCDraft(draft);
  if (issues.length > 0) return NextResponse.json({ error: "Application is not ready for handoff.", issues }, { status: 422 });

  const packetId = randomUUID();
  const packetHash = createHash("sha256").update(JSON.stringify(draft)).digest("hex");

  return NextResponse.json({
    status: "READY_FOR_OFFICIAL_HANDOFF",
    transmittalMode: COLORADO_SOS.transmittalMode,
    directStateApi: COLORADO_SOS.directApiSubmissionSupported,
    officialFilingUrl: COLORADO_SOS.officialNewBusinessFiling,
    officialNameAvailabilityUrl: COLORADO_SOS.officialNameAvailability,
    packetId,
    packetHash,
    feeRelief: {
      active: COLORADO_SOS.feeRelief.active,
      status: COLORADO_SOS.feeRelief.status
    },
    nextAction: "Open the official Colorado Secretary of State filing system, select Limited Liability Company (LLC), transfer the validated fields, complete the state-only registered-agent identity verification, review the live fee, attest, pay, and submit. No state filing has been transmitted by this API."
  });
}
