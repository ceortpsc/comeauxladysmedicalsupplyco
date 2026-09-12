import { NextResponse } from "next/server";

export async function GET(){return NextResponse.json({ok:true,service:"comeaux-ladys-medical-supply-platform",version:process.env.APP_VERSION||"0.1.0",environment:process.env.APP_ENV||"development",time:new Date().toISOString()})}
