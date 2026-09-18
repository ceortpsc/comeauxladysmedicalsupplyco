export type EnvironmentState = "planned"|"configured"|"connected"|"degraded"|"blocked"|"verified";
export type ApprovalMode = "automatic"|"human_review"|"external_handoff"|"manual_release";

export const APPLICATION = {
  id: "comeaux-ladys-medical-supply-platform",
  legalName: "Comeaux Lady's Medical Supply Co.",
  operatingName: "Comeaux Clinical Supply & Print Co.",
  tagline: "A Family Company — Built for Nurses, Trusted by Long-Term Care Facilities.",
  version: process.env.APP_VERSION || "0.2.0",
  environment: process.env.APP_ENV || "development",
  releaseCommit: process.env.RENDER_GIT_COMMIT || process.env.COMMIT_SHA || "unknown",
  jurisdictionProfile: "US-TX-primary-with-multi-state-business-services",
  regulatoryPrinciple: "prepare-validate-document-handoff-never-fabricate-approval"
} as const;

export const DOMAINS = [
  {id:"identity",name:"Identity & Access",owner:"security",capabilities:["accounts","sessions","roles","permissions","MFA-ready","audit"]},
  {id:"catalog",name:"Catalog & Inventory",owner:"commerce",capabilities:["products","variants","SKUs","inventory","bundles","pricing","promotions"]},
  {id:"commerce",name:"Commerce",owner:"commerce",capabilities:["cart","checkout","orders","returns","fulfillment","shipping","clinic-orders"]},
  {id:"billing",name:"Billing & Payments",owner:"finance",capabilities:["invoices","receipts","payment-plans","provider-adapters","reconciliation","refund-records"]},
  {id:"training",name:"Training & LMS",owner:"education",capabilities:["programs","courses","modules","attendance","assessments","grades","remediation","skills-records"]},
  {id:"facilities",name:"Facility Services",owner:"compliance",capabilities:["onboarding","staff-rosters","competencies","audits","QAPI","mock-survey"]},
  {id:"regulatory",name:"Regulatory Readiness",owner:"compliance",capabilities:["incident-command","self-report-prep","investigation","POC","IJ-removal-plan","TULIP-ready-packets"]},
  {id:"consultation",name:"Consultation Services",owner:"support",capabilities:["intake","scope","service-agreement","engagement-record","human-escalation","follow-up"]},
  {id:"assistant",name:"Andreaa Chan'nel AI Assistant",owner:"support",capabilities:["guided-intake","education","policy-navigation","drafting","routing","bounded-simulation"]},
  {id:"publishing",name:"Publishing",owner:"content",capabilities:["textbooks","workbooks","manuals","catalogs","invoice-pdfs","regulatory-packets"]},
  {id:"notifications",name:"Notifications",owner:"operations",capabilities:["email-adapter","event-notices","reminders","delivery-status"]},
  {id:"business-filings",name:"Business Filings",owner:"business-services",capabilities:["formation-intake","validation","packet-generation","official-handoff","evidence"]},
  {id:"integrations",name:"Integrations",owner:"platform",capabilities:["Stripe-adapter","TULIP-handoff","Texas-BON-verification-boundary","API-Hub-artifacts","Render-runtime"]},
  {id:"observability",name:"Observability",owner:"platform",capabilities:["health","logs","metrics","audit-events","release-evidence","runtime-status"]},
  {id:"artifacts",name:"Artifact Registry",owner:"platform",capabilities:["manifest","checksums","release-records","contract-registration","publication-registration"]}
] as const;

export const ROLES = [
  {id:"anonymous",scope:"public",permissions:["public.read"]},
  {id:"customer",scope:"self",permissions:["catalog.read","cart.manage","orders.self.read","billing.self.read","consultation.self.manage"]},
  {id:"student",scope:"self",permissions:["training.enrollment.read","training.lesson.read","training.attempt.create","training.progress.read","billing.self.read"]},
  {id:"instructor",scope:"assigned",permissions:["training.roster.read","training.grade.manage","training.attendance.manage","training.skills.recommend","training.content.read"]},
  {id:"facility_staff",scope:"facility",permissions:["facility.self.read","training.assigned.read","competency.self.read","incident.create"]},
  {id:"facility_manager",scope:"facility",permissions:["facility.manage","staff.manage","audit.manage","incident.manage","qapi.manage","training.assign"]},
  {id:"catalog_manager",scope:"commerce",permissions:["catalog.manage","inventory.manage","promotion.manage"]},
  {id:"fulfillment",scope:"commerce",permissions:["orders.fulfill","shipping.manage","returns.process"]},
  {id:"finance",scope:"billing",permissions:["billing.manage","invoice.manage","payment.reconcile","refund.record"]},
  {id:"compliance",scope:"regulated",permissions:["regulatory.manage","audit.manage","packet.prepare","external-handoff.prepare","evidence.manage"]},
  {id:"support",scope:"support",permissions:["consultation.manage","case.manage","customer.read-limited","notification.send"]},
  {id:"admin",scope:"tenant",permissions:["tenant.manage","users.manage","roles.assign-nonprivileged","catalog.manage","training.manage","facility.manage","billing.read","audit.read"]},
  {id:"super_admin",scope:"platform",permissions:["platform.manage","roles.assign","integrations.configure","release.approve","audit.read","artifact.manage"]},
  {id:"service_worker",scope:"service",permissions:["job.consume","job.result.write","artifact.register","notification.dispatch-adapter","theme.write"]},
  {id:"ai_assistant",scope:"bounded",permissions:["public.read","policy.read","consultation.intake.draft","training.explain","support.route"]}
] as const;

export const ASSISTANT_POLICY = {
  persona: "Andreaa Chan'nel",
  type: "AI assistant",
  employeeRendering: "virtual-assistant-persona-not-human-employee",
  requiredDisclosure: "Andreaa Chan'nel is an AI assistant. AI can make mistakes and is not perfect. Verify important information with the appropriate licensed professional, facility leader, payer, regulator, attorney, clinician, tax professional, or official government source as applicable.",
  prohibitedClaims:["human identity","licensed clinician unless separately verified human","attorney","government representative","regulator","guaranteed approval","guaranteed survey outcome"],
  humanEscalationTriggers:["legal advice","clinical diagnosis or treatment","mandatory-reporting uncertainty","regulated competency sign-off","credential issuance","tax election advice","financial dispute","government attestation","payment dispute","safety-critical uncertainty"],
  sourcePolicy:"prefer-current-primary-authority-for-regulatory-guidance",
  regulatedActions:"prepare-only-unless-authorized-external-connector-is-verified"
} as const;

export const ENDPOINTS = [
  {method:"GET",path:"/api/health",domain:"observability",auth:"public",purpose:"Liveness and release metadata"},
  {method:"GET",path:"/api/platform/status",domain:"observability",auth:"public",purpose:"Production control-plane status"},
  {method:"GET",path:"/api/platform/manifest",domain:"platform",auth:"public",purpose:"Application topology and capabilities"},
  {method:"GET",path:"/api/platform/access",domain:"identity",auth:"public",purpose:"Role and permission definitions without user assignments"},
  {method:"GET",path:"/api/platform/jobs",domain:"operations",auth:"public",purpose:"Safe job registry metadata"},
  {method:"GET",path:"/api/platform/workflows",domain:"operations",auth:"public",purpose:"Workflow registry and approval gates"},
  {method:"GET",path:"/api/platform/artifacts",domain:"artifacts",auth:"public",purpose:"Artifact types and registration policy"},
  {method:"GET",path:"/api/platform/engineering-principles",domain:"platform",auth:"public",purpose:"Machine-readable engineering governance registry"},
  {method:"GET",path:"/api/catalog",domain:"catalog",auth:"public",purpose:"Product catalog"},
  {method:"GET",path:"/api/lms/bootstrap",domain:"training",auth:"public-bootstrap",purpose:"LMS program metadata"},
  {method:"POST",path:"/api/business-filings/colorado/llc/validate",domain:"business-filings",auth:"public-intake",purpose:"Validate filing preparation data"},
  {method:"POST",path:"/api/business-filings/colorado/llc/handoff",domain:"business-filings",auth:"public-intake",purpose:"Prepare official state portal handoff evidence"},
  {method:"GET",path:"/api/runtime/theme",domain:"operations",auth:"public",purpose:"Current governed merchandising/training theme"},
  {method:"GET",path:"/api/runtime/evidence",domain:"observability",auth:"public",purpose:"Runtime dependency and release evidence"}
] as const;

export const JOBS = [
  {id:"runtime.heartbeat",queue:"comeaux:jobs",trigger:"interval",approval:"automatic" as ApprovalMode,handler:"worker",effect:"write-expiring-worker-heartbeat"},
  {id:"theme.generate",queue:"comeaux:jobs",trigger:"hourly-or-demand",approval:"automatic" as ApprovalMode,handler:"worker",effect:"generate-and-cache-governed-theme"},
  {id:"artifact.register",queue:"comeaux:jobs",trigger:"release-event",approval:"automatic" as ApprovalMode,handler:"worker",effect:"register-manifest-metadata-and-checksum"},
  {id:"deployment.evidence.capture",queue:"comeaux:jobs",trigger:"post-deploy",approval:"automatic" as ApprovalMode,handler:"worker",effect:"persist-release-evidence-record"},
  {id:"audit.snapshot",queue:"comeaux:jobs",trigger:"daily-or-manual",approval:"automatic" as ApprovalMode,handler:"worker",effect:"summarize-operational-audit-counters"},
  {id:"notification.dispatch",queue:"comeaux:jobs",trigger:"domain-event",approval:"automatic" as ApprovalMode,handler:"adapter",effect:"send-through-configured-provider-or-return-blocked"},
  {id:"invoice.render.request",queue:"comeaux:jobs",trigger:"invoice-issued",approval:"automatic" as ApprovalMode,handler:"publishing",effect:"prepare-printable-invoice-artifact"},
  {id:"lms.progress.recalculate",queue:"comeaux:jobs",trigger:"attempt-or-attendance-change",approval:"automatic" as ApprovalMode,handler:"training",effect:"recalculate-noncredential-progress"},
  {id:"credential.revalidation.prepare",queue:"comeaux:jobs",trigger:"revalidation-due",approval:"human_review" as ApprovalMode,handler:"compliance",effect:"prepare-verification-task-without-scraping"},
  {id:"regulatory.packet.prepare",queue:"comeaux:jobs",trigger:"incident-or-class-ready",approval:"human_review" as ApprovalMode,handler:"compliance",effect:"assemble-packet-ready-for-authorized-review"},
  {id:"business_filing.packet.prepare",queue:"comeaux:jobs",trigger:"validated-formation-intake",approval:"external_handoff" as ApprovalMode,handler:"business-services",effect:"prepare-state-filing-packet-and-handoff"},
  {id:"certificate.record.prepare",queue:"comeaux:jobs",trigger:"program-completion-candidate",approval:"human_review" as ApprovalMode,handler:"training",effect:"prepare-record-not-state-credential"},
  {id:"inventory.reorder.review",queue:"comeaux:jobs",trigger:"inventory-threshold",approval:"human_review" as ApprovalMode,handler:"commerce",effect:"create-purchase-review-task"},
  {id:"payment.reconcile",queue:"comeaux:jobs",trigger:"payment-provider-webhook",approval:"automatic" as ApprovalMode,handler:"billing",effect:"reconcile-only-after-signed-provider-event"}
] as const;

export const WORKFLOWS = [
  {id:"order-lifecycle",trigger:"order.created",steps:["validate-cart","reserve-stock","create-billing-record","fulfillment-queue","customer-notification"],gate:"payment-provider-status-required"},
  {id:"consultation-lifecycle",trigger:"consultation.requested",steps:["scope-classification","AI-intake-draft","service-selection","agreement-acceptance","human-routing","invoice-if-billable","follow-up"],gate:"human-escalation-for-regulated-advice"},
  {id:"student-learning-cycle",trigger:"enrollment.active",steps:["assign-content","track-attempts","attendance","assessment","remediation","completion-review"],gate:"human-signoff-for-regulated-competency"},
  {id:"facility-incident-response",trigger:"incident.created",steps:["resident-safety-prompt","classification","deadline-calculation","evidence-registry","investigation-plan","packet-preparation","leadership-review","external-handoff"],gate:"facility-leadership-determines-required-reporting"},
  {id:"plan-of-correction",trigger:"deficiency.received",steps:["citation-register","affected-resident-correction","at-risk-population-review","systemic-correction","monitoring-plan","completion-date","leadership-review"],gate:"facility-approval-before-submission"},
  {id:"business-formation",trigger:"formation.intake.completed",steps:["jurisdiction-validation","name-check-handoff","registered-agent-gate","packet-hash","official-portal-handoff","confirmation-record"],gate:"state-portal-attestation-and-fees-remain-external"},
  {id:"verified-professional-savings",trigger:"credential.verification.requested",steps:["collect-minimal-credential-data","authorized-source-check","store-hash-last4","entitlement-decision","revalidation-date"],gate:"no-unauthorized-scraping"},
  {id:"release-promotion",trigger:"release.candidate",steps:["typecheck","build","contracts","security","artifact-register","canary-deploy","smoke-test","error-log-check","approval","production-deploy","evidence-capture"],gate:"manual-production-release"}
] as const;

export const ARTIFACTS = [
  {id:"platform-web",type:"web-build",source:"apps/platform",registration:"release",immutable:true},
  {id:"platform-openapi",type:"openapi",source:"contracts/comeaux-platform.openapi.yaml",registration:"release",immutable:true},
  {id:"colorado-business-openapi",type:"openapi",source:"contracts/colorado-business-filings.openapi.yaml",registration:"release",immutable:true},
  {id:"database-schema",type:"sql",source:"db/001_platform.sql",registration:"release",immutable:true},
  {id:"production-control-schema",type:"sql",source:"db/002_production_control_plane.sql",registration:"release",immutable:true},
  {id:"ios-source",type:"mobile-source",source:"mobile/ios",registration:"release",immutable:true},
  {id:"brand-logo",type:"brand-svg",source:"apps/platform/public/brand/logo.svg",registration:"release",immutable:true},
  {id:"runtime-manifest",type:"operations",source:"docs/PRODUCTION_OPERATING_MODEL.md",registration:"release",immutable:true},
  {id:"engineering-principles",type:"governance",source:"config/engineering-principles.json",registration:"release",immutable:true},
  {id:"regulatory-packet",type:"regulated-document",source:"generated",registration:"per-packet",immutable:true},
  {id:"invoice-pdf",type:"financial-document",source:"generated",registration:"per-invoice",immutable:true},
  {id:"course-publication",type:"learning-publication",source:"generated",registration:"per-version",immutable:true}
] as const;

export const INTEGRATIONS = [
  {id:"render",state:"verified" as EnvironmentState,mode:"hosting-runtime",writeActions:true},
  {id:"render-key-value",state:"verified" as EnvironmentState,mode:"cache-and-queue",writeActions:true,warning:"free-tier-is-nonpersistent"},
  {id:"postgres",state:"blocked" as EnvironmentState,mode:"dedicated-system-of-record",writeActions:false,reason:"dedicated-production-instance-not-provisioned"},
  {id:"stripe",state:"configured" as EnvironmentState,mode:"provider-adapter",writeActions:false,reason:"live-credential-and-webhook-verification-required-before-connected"},
  {id:"texas-hhsc-tulip",state:"configured" as EnvironmentState,mode:"assisted-official-handoff",writeActions:false},
  {id:"texas-bon",state:"configured" as EnvironmentState,mode:"verification-boundary-and-resource-linking",writeActions:false},
  {id:"colorado-sos",state:"configured" as EnvironmentState,mode:"assisted-official-handoff",writeActions:false},
  {id:"gcp-api-hub",state:"configured" as EnvironmentState,mode:"registration-scripts",writeActions:false},
  {id:"artifact-registry",state:"configured" as EnvironmentState,mode:"publication-scripts",writeActions:false}
] as const;

export const PRODUCTION_GATES = [
  "typecheck",
  "optimized-build",
  "API-contract-review",
  "security-review",
  "secret-scan",
  "database-migration-review",
  "runtime-self-test",
  "health-check",
  "error-log-review",
  "artifact-registration",
  "rollback-target",
  "manual-production-approval"
] as const;

export function platformStatus(){
  const blockers = INTEGRATIONS.filter(x=>x.state==="blocked");
  return {
    ok:true,
    application:APPLICATION,
    domains:DOMAINS.length,
    roles:ROLES.length,
    endpoints:ENDPOINTS.length,
    jobs:JOBS.length,
    workflows:WORKFLOWS.length,
    artifacts:ARTIFACTS.length,
    integrations:INTEGRATIONS,
    blockers,
    productionReady:blockers.length===0 && APPLICATION.environment==="production"
  };
}
