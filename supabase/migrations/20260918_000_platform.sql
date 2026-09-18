create extension if not exists pgcrypto;
create schema if not exists comeaux;

create table if not exists comeaux.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,
  role text not null default 'customer',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists comeaux.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  category text not null,
  description text not null,
  price_cents integer not null check (price_cents >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists comeaux.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references comeaux.products(id) on delete cascade,
  variant_sku text not null unique,
  size text,
  color text,
  quantity_on_hand integer not null default 0 check(quantity_on_hand >= 0),
  reorder_point integer not null default 5,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists comeaux.courses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  jurisdiction text,
  required_hours numeric(6,2) not null default 0,
  approval_status text not null default 'approval-required',
  published boolean not null default false,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists comeaux.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references comeaux.courses(id) on delete cascade,
  module_key text not null,
  title text not null,
  sequence_no integer not null,
  expected_minutes integer not null default 0,
  requires_instructor_signoff boolean not null default false,
  unique(course_id,module_key)
);

create table if not exists comeaux.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references comeaux.users(id) on delete cascade,
  course_id uuid not null references comeaux.courses(id) on delete cascade,
  status text not null default 'enrolled',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  completion_percent numeric(5,2) not null default 0,
  unique(user_id,course_id)
);

create table if not exists comeaux.learning_attempts (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references comeaux.enrollments(id) on delete cascade,
  module_id uuid references comeaux.course_modules(id) on delete cascade,
  assessment_type text not null,
  score numeric(5,2),
  passed boolean,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  evidence jsonb not null default '{}'::jsonb
);

create table if not exists comeaux.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references comeaux.enrollments(id) on delete cascade,
  learning_mode text not null check(learning_mode in ('online','classroom','lab','clinical','remediation')),
  started_at timestamptz not null,
  ended_at timestamptz,
  verified_minutes integer not null default 0,
  verified_by uuid references comeaux.users(id),
  evidence jsonb not null default '{}'::jsonb
);

create table if not exists comeaux.skills_signoffs (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references comeaux.enrollments(id) on delete cascade,
  skill_key text not null,
  status text not null default 'pending',
  instructor_id uuid references comeaux.users(id),
  signed_at timestamptz,
  evidence jsonb not null default '{}'::jsonb,
  unique(enrollment_id,skill_key)
);

create table if not exists comeaux.regulatory_transmittals (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references comeaux.enrollments(id) on delete cascade,
  agency text not null,
  system_name text not null,
  transmittal_type text not null,
  status text not null default 'draft',
  external_reference text,
  packet jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  confirmed_at timestamptz
);

create table if not exists comeaux.payment_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references comeaux.users(id),
  enrollment_id uuid references comeaux.enrollments(id),
  provider text not null,
  provider_reference text,
  amount_cents integer not null check(amount_cents >= 0),
  kind text not null,
  status text not null,
  due_at timestamptz,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists comeaux.artifact_registry (
  id uuid primary key default gen_random_uuid(),
  artifact_type text not null,
  artifact_name text not null,
  version text not null,
  checksum_sha256 text,
  storage_uri text,
  commit_sha text,
  environment text,
  created_at timestamptz not null default now(),
  unique(artifact_type,artifact_name,version)
);

create table if not exists comeaux.audit_events (
  id bigserial primary key,
  actor_user_id uuid references comeaux.users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  before_json jsonb,
  after_json jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_enrollment_status on comeaux.enrollments(status, enrolled_at desc);
create index if not exists idx_transmittal_status on comeaux.regulatory_transmittals(agency, system_name, status);
create index if not exists idx_inventory_variant on comeaux.product_variants(product_id, quantity_on_hand);
