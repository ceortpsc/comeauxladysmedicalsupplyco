import { NextResponse } from "next/server";
import { WORKFLOWS } from "../../../../lib/production-registry";

export async function GET(){return NextResponse.json({ok:true,count:WORKFLOWS.length,workflows:WORKFLOWS});}
