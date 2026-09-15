import { NextResponse } from "next/server";

export const dynamic="force-dynamic";

export async function GET(){
  return NextResponse.json({
    ok:true,
    service:"comeaux-ladys-medical-supply-platform",
    release:{
      version:process.env.APP_VERSION||"0.1.0",
      environment:process.env.APP_ENV||"development",
      commit:process.env.RENDER_GIT_COMMIT||process.env.GIT_COMMIT||null,
      branch:process.env.RENDER_GIT_BRANCH||null
    },
    dependencies:{
      postgres:process.env.DATABASE_URL?"configured":"not_configured",
      keyValue:process.env.REDIS_URL?"configured":"not_configured",
      trendSignals:process.env.TREND_SIGNALS?"configured":"calendar_rules_only"
    },
    policy:{productionRequiresExplicitApproval:true,aiTrendClaimsRequireConfiguredSignals:true},
    timestamp:new Date().toISOString()
  });
}
