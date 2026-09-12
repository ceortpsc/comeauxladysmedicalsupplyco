-- Colorado business filing registry
-- Stores metadata and encrypted application payloads only. Do not place SSNs, EIN responsible-party identifiers,
-- Colorado driver-license/ID numbers, or state portal credentials in this schema.

create extension if not exists pgcrypto;
create schema if not exists business_filings;

create table if not exists business_filings.applications (
  id uuid primary key default gen_random_uuid(),
  jurisdiction text not null default 'CO',
  filing_type text not null default 'LLC_ARTICLES_OF_ORGANIZATION',
  legal_name text not null,
  status text not null check (status in ('draft','validated','ready_for_handoff','submitted_external','accepted','rejected','withdrawn')) default 'draft',
  transmittal_mode text not null default 'assisted_official_handoff',
  payload_ciphertext bytea,
  payload_key_version text,
  packet_hash text,
  official_confirmation_number text,
  official_entity_id text,
  submitted_external_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists business_filings.fee_relief_checks (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references business_filings.applications(id) on delete cascade,
  program_code text,
  status text not null check (status in ('not_checked','not_available','potentially_eligible','verified_eligible','verified_ineligible')),
  official_source_url text,
  source_effective_start date,
  source_effective_end date,
  checked_at timestamptz not null default now(),
  checked_by text,
  evidence jsonb not null default '{}'::jsonb
);

create table if not exists business_filings.transmittal_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references business_filings.applications(id) on delete cascade,
  event_type text not null check (event_type in ('validated','handoff_created','official_portal_opened','user_reported_submitted','confirmation_recorded','state_status_updated')),
  mode text not null default 'assisted_official_handoff',
  external_url text,
  external_reference text,
  packet_hash text,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists business_filing_status_idx on business_filings.applications(status, updated_at desc);
create index if not exists business_filing_name_idx on business_filings.applications(lower(legal_name));
create index if not exists business_filing_events_idx on business_filings.transmittal_events(application_id, created_at desc);

comment on table business_filings.applications is 'Administrative filing-preparation registry. Final Colorado SOS submission remains external unless an authorized API is later established.';
comment on column business_filings.applications.payload_ciphertext is 'Application-layer encrypted filing payload. Never store state identity-verification credentials in this field.';
