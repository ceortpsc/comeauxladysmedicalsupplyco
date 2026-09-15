import { NextResponse } from "next/server";
import { JOBS } from "../../../../lib/production-registry";

export async function GET(){return NextResponse.json({ok:true,count:JOBS.length,jobs:JOBS});}
