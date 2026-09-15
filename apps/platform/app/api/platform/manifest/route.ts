import { NextResponse } from "next/server";
import { APPLICATION, DOMAINS, ENDPOINTS, INTEGRATIONS, PRODUCTION_GATES, ASSISTANT_POLICY } from "../../../../lib/production-registry";

export const dynamic = "force-dynamic";

export async function GET(){
  return NextResponse.json({
    ok:true,
    application:APPLICATION,
    domains:DOMAINS,
    endpoints:ENDPOINTS,
    integrations:INTEGRATIONS,
    productionGates:PRODUCTION_GATES,
    aiAssistant:{
      persona:ASSISTANT_POLICY.persona,
      type:ASSISTANT_POLICY.type,
      disclosure:ASSISTANT_POLICY.requiredDisclosure,
      regulatedActions:ASSISTANT_POLICY.regulatedActions
    }
  });
}
