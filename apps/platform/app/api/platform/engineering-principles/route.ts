import { NextResponse } from "next/server";
import { ENGINEERING_PRINCIPLES, engineeringPrincipleSummary } from "../../../../lib/engineering-principles";

export const dynamic = "force-dynamic";

export async function GET(){
  return NextResponse.json({ok:true,summary:engineeringPrincipleSummary(),registry:ENGINEERING_PRINCIPLES});
}
