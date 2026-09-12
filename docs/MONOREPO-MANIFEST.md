# Monorepo manifest

## Applications
- `apps/platform` — web storefront, academy, LMS, dashboards and API routes.
- `mobile/ios` — native iOS client.

## Shared packages
- `@comeaux/brand` — canonical naming, palette and brand metadata.
- `@comeaux/catalog` — products, quantities, roles and category taxonomy.
- `@comeaux/training` — program metadata, hours, learning-engine stages and regulatory status.
- `@comeaux/ai-core` — deterministic safe scenario engine and optional provider interface.
- `@comeaux/payments` — checkout/invoice gateway interface and installment-plan math.
- `@comeaux/integrations` — external-system lifecycle and TULIP handoff contract.
- `@comeaux/publishing` — PDF/print artifact registry types.
- `@comeaux/observability` — audit event contract.

## Data and contracts
- `db/001_platform.sql` — first PostgreSQL platform schema.
- `contracts/comeaux-platform.openapi.yaml` — API catalog source.
- `config/artifacts.json` — immutable release artifact manifest.

## Infrastructure
- `render.yaml`
- `infra/gcp/api-hub/register.sh`
- `infra/gcp/artifact-registry/publish.sh`
- `.github/workflows/ci.yml`
