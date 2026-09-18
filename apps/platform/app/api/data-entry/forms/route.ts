import { NextResponse } from "next/server";
import { publicFormRegistry } from "@comeaux/data-entry";

export async function GET(){
  return NextResponse.json({
    engineVersion:"0.1.0",
    forms:publicFormRegistry(),
    governance:{
      aiCanMakeMistakes:true,
      authoritativeSource:false,
      humanReviewRequiredFor:["regulated","financial","clinical","tax","legal","government"],
      prohibitedSecrets:true
    }
  });
}
