import { NextResponse } from "next/server";
import { ROLES, ASSISTANT_POLICY } from "../../../../lib/production-registry";

export async function GET(){
  return NextResponse.json({ok:true,roles:ROLES,assistantPolicy:ASSISTANT_POLICY});
}
