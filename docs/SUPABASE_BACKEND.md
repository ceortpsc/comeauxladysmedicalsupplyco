# Supabase backend

Supabase is the primary production data plane for Comeaux Lady's Medical Supply Co.

## Responsibilities

- PostgreSQL system of record
- Authentication
- Row Level Security
- Storage for catalog and generated artifacts
- Realtime events where appropriate
- Edge Functions where a serverless action is preferable to an always-on worker

Render remains the public Next.js runtime.

## Environment variables

Browser-safe:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Server-only:

```env
SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

Never expose `SUPABASE_SECRET_KEY` to the browser.

## Schema order

1. Apply `db/001_platform.sql`.
2. Apply `supabase/migrations/20260918_001_security.sql`.
3. Expose the `comeaux` schema in Supabase API settings if Data API access to the custom schema is required.
4. Seed products/programs only after schema + RLS validation.

## Production truth boundary

Repository integration can be deployed before a Supabase project is connected. In that state `/api/platform/backend-status` must report `awaiting_supabase_project_credentials`; the application must not represent Postgres/Auth/Storage/Realtime as connected.

## Cost model

Free is appropriate for development and low-activity launch testing. It can pause after inactivity and has lower quotas/no automatic paid-plan backup guarantees. Pro is the baseline production tier when always-on behavior and paid-plan operational guarantees are required.
