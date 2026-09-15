import { NextResponse } from "next/server";
import { ARTIFACTS } from "../../../../lib/production-registry";

export async function GET(){return NextResponse.json({ok:true,count:ARTIFACTS.length,artifacts:ARTIFACTS});}
