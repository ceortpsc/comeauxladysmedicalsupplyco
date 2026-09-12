import { NextResponse } from "next/server";
import { validateColoradoLLCDraft, type ColoradoLLCDraft } from "../../../../../../lib/colorado-business";

export async function POST(request: Request) {
  let draft: ColoradoLLCDraft;
  try {
    draft = await request.json();
  } catch {
    return NextResponse.json({ valid: false, issues: [{ field: "request", message: "Invalid JSON request." }] }, { status: 400 });
  }

  const issues = validateColoradoLLCDraft(draft);
  return NextResponse.json({
    valid: issues.length === 0,
    issues,
    filingType: "Colorado LLC Articles of Organization",
    directStateSubmission: false
  }, { status: issues.length === 0 ? 200 : 422 });
}
