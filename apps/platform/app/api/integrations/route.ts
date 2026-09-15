import { NextResponse } from "next/server";
import { publicAdapterRegistry } from "@comeaux/external-gateway";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    policy: {
      zeroCostOnly: true,
      defaultExternalWrite: false,
      sensitiveData: "redacted_before_persistence",
      completionRule: "external actions are not represented as submitted, accepted, paid, licensed, approved, or delivered without evidence"
    },
    adapters: publicAdapterRegistry()
  });
}
