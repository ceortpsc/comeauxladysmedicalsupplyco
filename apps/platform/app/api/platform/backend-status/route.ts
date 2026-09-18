import { NextResponse } from "next/server";

export async function GET(){
  const projectRef=process.env.SUPABASE_PROJECT_REF || null;
  const projectUrl=process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  const publicUrlConfigured=Boolean(projectUrl);
  const publishableConfigured=Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const secretConfigured=Boolean(process.env.SUPABASE_SECRET_KEY);
  return NextResponse.json({
    backend:"supabase",
    projectRef,
    projectUrl,
    configured:publicUrlConfigured&&publishableConfigured,
    serverAdminConfigured:secretConfigured,
    capabilities:{
      postgres:publicUrlConfigured,
      auth:publicUrlConfigured&&publishableConfigured,
      storage:publicUrlConfigured&&publishableConfigured,
      realtime:publicUrlConfigured&&publishableConfigured,
      edgeFunctions:publicUrlConfigured&&publishableConfigured
    },
    security:{
      browserUsesPublishableKey:true,
      secretKeyServerOnly:true,
      rowLevelSecurityRequired:true
    },
    state:publicUrlConfigured&&publishableConfigured?"configured":"awaiting_supabase_project_credentials"
  });
}
