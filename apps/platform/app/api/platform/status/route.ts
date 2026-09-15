import { NextResponse } from "next/server";
import { platformStatus } from "../../../../lib/production-registry";

export const dynamic="force-dynamic";
export async function GET(){return NextResponse.json({...platformStatus(),time:new Date().toISOString()});}
