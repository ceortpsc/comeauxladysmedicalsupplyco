BEGIN;

CREATE SCHEMA IF NOT EXISTS comeaux_ops;

CREATE TABLE IF NOT EXISTS comeaux_ops.service_registry (
  service_id text PRIMARY KEY,
  name text NOT NULL,
  owner_role text NOT NULL,
  environment text NOT NULL,
  state text NOT NULL CHECK (state IN ('planned','configured','connected','degraded','blocked','verified')),
  endpoint text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comeaux_ops.role_registry (
  role_id text PRIMARY KEY,
  scope text NOT NULL,
  description text NOT NULL,
  privileged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comeaux_ops.permission_registry (
  permission_id text PRIMARY KEY,
  domain text NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comeaux_ops.role_permissions (
  role_id text NOT NULL REFERENCES comeaux_ops.role_registry(role_id) ON DELETE CASCADE,
  permission_id text NOT NULL REFERENCES comeaux_ops.permission_registry(permission_id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS comeaux_ops.job_definitions (
  job_type text PRIMARY KEY,
  queue_name text NOT NULL,
  trigger_type text NOT NULL,
  approval_mode text NOT NULL CHECK (approval_mode IN ('automatic','human_review','external_handoff','manual_release')),
  handler text NOT NULL,
  effect text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  max_attempts integer NOT NULL DEFAULT 3 CHECK (max_attempts BETWEEN 1 AND 20),
  timeout_seconds integer NOT NULL DEFAULT 300 CHECK (timeout_seconds BETWEEN 1 AND 86400),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comeaux_ops.job_runs (
  run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type text NOT NULL REFERENCES comeaux_ops.job_definitions(job_type),
  external_job_id text,
  status text NOT NULL,
  payload_hash text,
  result jsonb NOT NULL DEFAULT '{}'::jsonb,
  attempt integer NOT NULL DEFAULT 1,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_runs_type_created ON comeaux_ops.job_runs(job_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_runs_status_created ON comeaux_ops.job_runs(status, created_at DESC);

CREATE TABLE IF NOT EXISTS comeaux_ops.workflow_definitions (
  workflow_id text PRIMARY KEY,
  trigger_event text NOT NULL,
  steps jsonb NOT NULL,
  approval_gate text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comeaux_ops.workflow_runs (
  run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id text NOT NULL REFERENCES comeaux_ops.workflow_definitions(workflow_id),
  correlation_id text,
  status text NOT NULL,
  current_step text,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workflow_runs_corr ON comeaux_ops.workflow_runs(correlation_id);

CREATE TABLE IF NOT EXISTS comeaux_ops.event_outbox (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  aggregate_type text NOT NULL,
  aggregate_id text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  available_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outbox_pending ON comeaux_ops.event_outbox(status, available_at);

CREATE TABLE IF NOT EXISTS comeaux_ops.artifact_definitions (
  artifact_type text PRIMARY KEY,
  source_pattern text NOT NULL,
  registration_mode text NOT NULL,
  immutable boolean NOT NULL DEFAULT true,
  retention_policy text NOT NULL DEFAULT 'retain-by-policy',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comeaux_ops.artifact_instances (
  artifact_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_type text NOT NULL REFERENCES comeaux_ops.artifact_definitions(artifact_type),
  logical_name text NOT NULL,
  version text NOT NULL,
  commit_sha text,
  checksum_sha256 text NOT NULL,
  storage_uri text,
  environment text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  registered_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(artifact_type, logical_name, version, checksum_sha256)
);

CREATE TABLE IF NOT EXISTS comeaux_ops.integration_registry (
  integration_id text PRIMARY KEY,
  state text NOT NULL CHECK (state IN ('planned','configured','connected','degraded','blocked','verified')),
  mode text NOT NULL,
  write_actions_enabled boolean NOT NULL DEFAULT false,
  reason text,
  last_verified_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comeaux_ops.release_evidence (
  evidence_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL,
  commit_sha text NOT NULL,
  branch text NOT NULL,
  environment text NOT NULL,
  render_deploy_id text,
  build_status text NOT NULL,
  typecheck_status text NOT NULL,
  health_status text NOT NULL,
  smoke_status text NOT NULL,
  error_log_status text NOT NULL,
  rollback_commit_sha text,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  approved_by text,
  approved_at timestamptz,
  captured_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comeaux_ops.policy_versions (
  policy_id text NOT NULL,
  version text NOT NULL,
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft','review','active','superseded','archived')),
  content_hash text NOT NULL,
  effective_at timestamptz,
  superseded_at timestamptz,
  PRIMARY KEY(policy_id, version)
);

INSERT INTO comeaux_ops.role_registry(role_id,scope,description,privileged) VALUES
('anonymous','public','Unauthenticated public access',false),
('customer','self','Customer self-service access',false),
('student','self','Student learning access',false),
('instructor','assigned','Instructor access to assigned cohorts/classes',false),
('facility_staff','facility','Facility staff access within assigned facility',false),
('facility_manager','facility','Facility manager operational access',true),
('catalog_manager','commerce','Catalog and inventory administration',true),
('fulfillment','commerce','Order fulfillment and shipping operations',false),
('finance','billing','Billing, invoice and payment reconciliation',true),
('compliance','regulated','Regulatory readiness and evidence management',true),
('support','support','Consultation, case and customer support',false),
('admin','tenant','Tenant administration',true),
('super_admin','platform','Platform-wide privileged administration',true),
('service_worker','service','Background worker service principal',true),
('ai_assistant','bounded','Governed AI assistant with bounded permissions',false)
ON CONFLICT (role_id) DO UPDATE SET scope=EXCLUDED.scope,description=EXCLUDED.description,privileged=EXCLUDED.privileged;

INSERT INTO comeaux_ops.job_definitions(job_type,queue_name,trigger_type,approval_mode,handler,effect,max_attempts,timeout_seconds) VALUES
('runtime.heartbeat','comeaux:jobs','interval','automatic','worker','write-expiring-worker-heartbeat',3,60),
('theme.generate','comeaux:jobs','hourly-or-demand','automatic','worker','generate-and-cache-governed-theme',3,120),
('artifact.register','comeaux:jobs','release-event','automatic','worker','register-manifest-metadata-and-checksum',3,120),
('deployment.evidence.capture','comeaux:jobs','post-deploy','automatic','worker','persist-release-evidence-record',3,120),
('audit.snapshot','comeaux:jobs','daily-or-manual','automatic','worker','summarize-operational-audit-counters',3,120),
('notification.dispatch','comeaux:jobs','domain-event','automatic','adapter','dispatch-or-block-without-provider',5,300),
('invoice.render.request','comeaux:jobs','invoice-issued','automatic','publishing','prepare-printable-invoice-artifact',5,300),
('lms.progress.recalculate','comeaux:jobs','attempt-or-attendance-change','automatic','training','recalculate-noncredential-progress',5,120),
('credential.revalidation.prepare','comeaux:jobs','revalidation-due','human_review','compliance','prepare-verification-task-without-scraping',3,300),
('regulatory.packet.prepare','comeaux:jobs','incident-or-class-ready','human_review','compliance','assemble-packet-ready-for-authorized-review',3,600),
('business_filing.packet.prepare','comeaux:jobs','validated-formation-intake','external_handoff','business-services','prepare-state-filing-packet-and-handoff',3,300),
('certificate.record.prepare','comeaux:jobs','program-completion-candidate','human_review','training','prepare-record-not-state-credential',3,300),
('inventory.reorder.review','comeaux:jobs','inventory-threshold','human_review','commerce','create-purchase-review-task',3,120),
('payment.reconcile','comeaux:jobs','signed-payment-provider-event','automatic','billing','reconcile-after-signed-provider-event',5,300)
ON CONFLICT (job_type) DO UPDATE SET queue_name=EXCLUDED.queue_name,trigger_type=EXCLUDED.trigger_type,approval_mode=EXCLUDED.approval_mode,handler=EXCLUDED.handler,effect=EXCLUDED.effect,max_attempts=EXCLUDED.max_attempts,timeout_seconds=EXCLUDED.timeout_seconds,updated_at=now();

INSERT INTO comeaux_ops.workflow_definitions(workflow_id,trigger_event,steps,approval_gate) VALUES
('order-lifecycle','order.created','["validate-cart","reserve-stock","create-billing-record","fulfillment-queue","customer-notification"]'::jsonb,'payment-provider-status-required'),
('consultation-lifecycle','consultation.requested','["scope-classification","AI-intake-draft","service-selection","agreement-acceptance","human-routing","invoice-if-billable","follow-up"]'::jsonb,'human-escalation-for-regulated-advice'),
('student-learning-cycle','enrollment.active','["assign-content","track-attempts","attendance","assessment","remediation","completion-review"]'::jsonb,'human-signoff-for-regulated-competency'),
('facility-incident-response','incident.created','["resident-safety-prompt","classification","deadline-calculation","evidence-registry","investigation-plan","packet-preparation","leadership-review","external-handoff"]'::jsonb,'facility-leadership-determines-required-reporting'),
('plan-of-correction','deficiency.received','["citation-register","affected-resident-correction","at-risk-population-review","systemic-correction","monitoring-plan","completion-date","leadership-review"]'::jsonb,'facility-approval-before-submission'),
('business-formation','formation.intake.completed','["jurisdiction-validation","name-check-handoff","registered-agent-gate","packet-hash","official-portal-handoff","confirmation-record"]'::jsonb,'state-portal-attestation-and-fees-remain-external'),
('verified-professional-savings','credential.verification.requested','["collect-minimal-credential-data","authorized-source-check","store-hash-last4","entitlement-decision","revalidation-date"]'::jsonb,'no-unauthorized-scraping'),
('release-promotion','release.candidate','["typecheck","build","contracts","security","artifact-register","canary-deploy","smoke-test","error-log-check","approval","production-deploy","evidence-capture"]'::jsonb,'manual-production-release')
ON CONFLICT (workflow_id) DO UPDATE SET trigger_event=EXCLUDED.trigger_event,steps=EXCLUDED.steps,approval_gate=EXCLUDED.approval_gate,updated_at=now();

INSERT INTO comeaux_ops.artifact_definitions(artifact_type,source_pattern,registration_mode,immutable) VALUES
('platform-web','apps/platform','release',true),
('platform-openapi','contracts/comeaux-platform.openapi.yaml','release',true),
('colorado-business-openapi','contracts/colorado-business-filings.openapi.yaml','release',true),
('database-schema','db/001_platform.sql','release',true),
('production-control-schema','db/002_production_control_plane.sql','release',true),
('ios-source','mobile/ios','release',true),
('brand-logo','apps/platform/public/brand/logo.svg','release',true),
('runtime-manifest','docs/PRODUCTION_OPERATING_MODEL.md','release',true),
('regulatory-packet','generated','per-packet',true),
('invoice-pdf','generated','per-invoice',true),
('course-publication','generated','per-version',true)
ON CONFLICT (artifact_type) DO UPDATE SET source_pattern=EXCLUDED.source_pattern,registration_mode=EXCLUDED.registration_mode,immutable=EXCLUDED.immutable;

INSERT INTO comeaux_ops.integration_registry(integration_id,state,mode,write_actions_enabled,reason) VALUES
('render','verified','hosting-runtime',true,null),
('render-key-value','verified','cache-and-queue',true,'free tier is nonpersistent'),
('postgres','blocked','dedicated-system-of-record',false,'Dedicated Comeaux production database not provisioned'),
('stripe','configured','provider-adapter',false,'Live key and signed webhook verification required'),
('texas-hhsc-tulip','configured','assisted-official-handoff',false,'No verified third-party direct-write interface'),
('texas-bon','configured','verification-boundary',false,'No credential issuance or unauthorized scraping'),
('colorado-sos','configured','assisted-official-handoff',false,'Final attestation and filing remain on official state portal'),
('gcp-api-hub','configured','registration-scripts',false,'GCP project authorization required'),
('artifact-registry','configured','publication-scripts',false,'GCP project authorization required')
ON CONFLICT (integration_id) DO UPDATE SET state=EXCLUDED.state,mode=EXCLUDED.mode,write_actions_enabled=EXCLUDED.write_actions_enabled,reason=EXCLUDED.reason,updated_at=now();

COMMIT;
