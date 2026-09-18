# Comeaux Lady's Medical Supply Co. — Implementation-Grade Environment Report

## Release scope

Branch: `feature/full-seed-data-engine`

This environment extends the existing Next.js/Node monorepo with:
- 12 fully seeded luxury catalog products
- 9 fully represented supply departments
- 4 learning-program tracks
- contract-first internal/external workflows
- Andreaa Chan'nel governed AI support
- registry-driven data-entry engine
- Contact Us intake
- governance / rules / handbook surfaces
- XML import/export boundary
- source-controlled product assets
- cost-minimized production deployment

## Truth-state model

The platform must keep these states distinct:

`draft -> entered -> suggested -> validated -> needs_review -> prepared -> ready_for_handoff -> submitted -> accepted -> verified -> paid -> completed`

No later state may be inferred from an earlier one.

## Catalog

Canonical source: `packages/catalog/src/index.ts`

Requirements:
- exactly 12 seeded products
- every seeded product starts at quantity 12
- all 9 departments have at least one product
- every product has a SKU, price, compare-at price, colors/design options, media asset, claim boundary, and role tags
- generated marketing art is concept/marketing material, not manufacturer evidence
- clinical/performance claims require actual sourced manufacturer documentation

## Data-entry engine

Canonical source: `packages/data-entry/src/index.ts`

Form registry currently covers:
1. customer contact
2. business enrollment
3. product catalog entry
4. learning enrollment
5. LTC facility consultation
6. invoice/service entry
7. external handoff preparation

Every field declares:
- kind
- required state
- sensitivity
- description
- AI-assist mode
- validation rules
- external-submission permission

The generic AI/data-entry layer blocks secrets and highly sensitive identifiers including passwords, SSNs, ITINs, card/bank credentials, API keys, and identity-document numbers.

## Andreaa Chan'nel AI support

Canonical source: `packages/ai-core/src/index.ts`

Rules:
- clearly disclosed as AI
- can make mistakes
- does not impersonate a human employee
- does not represent itself as a clinician, attorney, tax professional, regulator, or government official
- routes high-risk matters for human/professional review
- never claims external success without evidence
- does not request secrets or PHI in general chat

Routes:
- `/assistant`
- `POST /api/assistant/chat`

## Data Entry Studio

Routes:
- `/data-entry`
- `GET /api/data-entry/forms`
- `POST /api/data-entry/process`
- `POST /api/data-entry/xml`

XML safety:
- Comeaux flat-record schema only
- 100 KB input limit
- DTD/entity declarations rejected
- prohibited sensitive field IDs rejected
- XML export requires successful form validation

## Contact Us

Routes:
- `/contact`
- `POST /api/contact`

Current production environment behavior:
- validates and prepares a support packet
- returns an internal case reference
- does not falsely claim email/ticket delivery
- outbound provider remains configuration-only until an authorized connector is available

## Governance

Routes:
- `/governance`
- `/handbook/engineering`
- `/api/platform/engineering-principles`

Mandatory operating rules:
- truth-state discipline
- human authority gates
- sensitive-data restrictions
- lowest-viable-cost infrastructure
- current-source regulatory review
- clinical scope boundaries
- evidence before external-success claims

## Learning programs

Canonical source: `packages/training/src/index.ts`

Seeded tracks:
- TX-MA-BASIC-140
- TX-MA-RENEW-8
- TX-CNA-FOUNDATIONS
- CLINIC-ONBOARDING

Publication or internal enrollment does not equal regulator approval, exam authorization, credential eligibility, or credential issuance.

## API contracts

Primary OpenAPI:
- `contracts/comeaux-platform.openapi.yaml`
- `contracts/internal-external-gateway.openapi.yaml`
- `contracts/colorado-business-filings.openapi.yaml`

Contract-first rule:
- implement route
- define request/response contract
- validate build
- register artifact
- deploy canary/preview
- verify runtime
- only then promote

## Cost-minimized infrastructure mandate

Policy:
- choose the lowest-cost plan that satisfies the required production capability
- paid resources are authorized when required for durability, persistence, always-on execution, scheduled jobs, or fee-bearing external actions
- never select a higher tier while a lower tier satisfies the same requirement
- external government, registrar, payment, credential, and regulatory fees remain separate and must be represented accurately
- billing-provider or payment-method failures are hard provisioning gates, not successful deployments

Target minimums:
- Postgres: smallest paid persistent plan with minimum storage
- Key Value: smallest paid persistent plan with no-eviction queue policy
- Cron: smallest paid plan, billed only for active execution where supported
- Background worker: smallest paid always-on worker plan
- Web: free only if acceptable for production availability; otherwise smallest always-on plan

## Background work under cost-minimized production

Paid workers and cron are authorized at the lowest viable tier. If billing or connector capability prevents provisioning, the application must fall back to request-driven execution without claiming durable background processing.

Until paid resources are actually provisioned and connected, background behavior may use:
- request-driven execution
- startup verification
- on-demand admin actions
- GitHub Actions where available
- ephemeral Key Value only for non-durable caches/queues

## Deployment gates

Required before any production promotion:
1. TypeScript typecheck
2. optimized Next.js build
3. route generation
4. API contract presence
5. lowest-cost policy check
6. runtime self-test
7. error-log review
8. artifact registry update
9. external-integration truth-state review
10. manual production approval

## Remaining blockers

- dedicated durable Comeaux Postgres remains pending until Render billing is enabled
- paid durable worker/cron remain pending until Render billing is enabled
- no live Stripe charging
- no direct government write API
- no authoritative external credential/regulatory submission connector
- generated catalog assets are internal visual assets, not sourced manufacturer photos/spec evidence

These blockers do not prevent preview/testing, but they prevent claims of a fully durable regulated production system.
