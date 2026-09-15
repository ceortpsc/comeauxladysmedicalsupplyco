# Render Runtime Manifesto

## Mission
Operate Comeaux Lady’s Medical Supply Co. as a measurable, reversible, policy-governed Render runtime. Every resource must be classified as planned, configured, deployed, live, degraded, blocked, or retired. No deployment is called verified until build, startup, health, logs, and smoke checks agree.

## Runtime topology
- **Web/API:** Next.js monorepo service in Ohio.
- **Key Value / queue:** `comeaux-jobs`, Valkey-compatible, `noeviction` for durable queue semantics. Free instances are non-persistent and may lose data on restart; production queue durability requires a paid persistent plan.
- **Background worker:** long-running queue consumer executing `theme.generate` and heartbeat jobs; graceful SIGTERM drain.
- **Cron producer:** hourly theme refresh enqueuer.
- **PostgreSQL:** dedicated Comeaux database is required. It must not share the unrelated Food Care Center database. Workspace free-tier limits currently block a second free database; provision only after paid database approval or a deliberate account-level change.
- **Maven regulatory gateway:** Java 21 / Spring Boot service. Deploy through Docker/Blueprint/Dashboard because the direct service connector does not expose native Java creation.
- **Render Workflows:** optional fan-out engine for high-volume AI/ETL jobs. Workflows are beta and require Dashboard deployment; do not claim deployed until observed there.

## Execution policy
1. Feature branches may deploy only to preview/canary services.
2. `staging` is the integration deployment target.
3. `main` is production and requires explicit `ALLOW_PRODUCTION_DEPLOY=YES` plus an approved release record.
4. Build command must complete dependency install, TypeScript validation, and optimized build.
5. Runtime must bind to Render’s assigned port through the framework.
6. `/api/health`, `/api/runtime/evidence`, and `/api/runtime/theme` must return successful responses before verification.
7. Queue-backed workers use `noeviction`; cache policies such as LRU are prohibited for job queues.
8. Workers stop accepting work on SIGTERM, finish/checkpoint current work, close clients, and exit cleanly.
9. Secrets never enter Git. `DATABASE_URL`, `REDIS_URL`, API keys, Stripe secrets and regulatory credentials are environment variables or managed secret references.
10. Production promotion is blocked on unresolved migration, auth, payment, regulatory, or data-integrity failures.

## What’s Hot Now engine
The engine has two modes:
- `calendar_rules`: deterministic LTC/nursing merchandising themes based on current period. This mode never claims live internet popularity.
- `configured_signals`: uses externally supplied `TREND_SIGNALS`; generated content still requires review before public factual claims.

The worker stores the active theme at `comeaux:theme:current` with a one-hour TTL. `/api/runtime/theme` degrades safely to an explicitly labeled fallback when Key Value is unavailable.

## Deployment commands
```bash
npm run typecheck
npm run build
npm run maven:verify
npm run render:policy
RENDER_SERVICE_ID=srv_x BASE_URL=https://example.onrender.com npm run render:deploy
```

## Evidence standard
Capture for every release:
- Git commit SHA and branch
- Render deploy ID and final state
- dependency audit/build output
- TypeScript result
- route generation
- service startup / ready line
- health and runtime smoke-test output
- error-log query
- CPU/memory/latency metrics where available
- database status/connection metrics when database exists
- Key Value status
- unresolved blockers and rollback target

## Cost boundary
Direct automation may create free resources. Paid Postgres, persistent Key Value, starter background workers, cron jobs, or Workflow compute must not be created silently. The full-stack reference Blueprint under `infra/render/full-stack.render.yaml` is a desired-state design and must be cost-reviewed before sync.
