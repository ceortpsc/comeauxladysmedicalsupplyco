# Engineering Principles & Production Doctrine

**Version:** 2026.09.18

This document is the human-readable companion to `config/engineering-principles.json`. The JSON registry is the machine-readable contract exposed through the platform API and handbook UI.

## Authority and applicability

These principles apply to every page, API, worker, background job, AI-assisted workflow, data-entry form, commerce feature, learning module, regulatory workflow, integration, artifact, deployment, and operational action in the Comeaux Lady's Medical Supply Co. platform.

## Universal mandates

1. Evidence controls status. Never infer external submission, approval, payment, credentialing, licensure, deployment, or acceptance.
2. Every write path must have an explicit actor, authorization boundary, validation rule, audit event, and failure state.
3. No feature may silently create a paid resource or charge under the zero-cost mandate.
4. Sensitive data is minimized, redacted from generic logs/evidence, and never committed to source control.
5. AI may assist, explain, normalize, classify, draft, and detect inconsistencies; it may not fabricate facts, attest for a person, or bypass required human/regulatory review.
6. Production behavior must be reproducible from versioned source, contracts, migrations, configuration, and immutable artifacts.

## Truth-state vocabulary

`DESIGNED → SCAFFOLDED → IMPLEMENTED → CONFIGURED → CONNECTED → TESTED → DEPLOYED → VERIFIED → BLOCKED`

A state may advance only when the evidence required for that state exists. Public reachability, a generated document, a prepared packet, a UI badge, or an AI statement is never sufficient evidence by itself.

## Architecture & Source of Truth

1. Use domain boundaries with explicit ownership; UI is never the source of business truth.
2. Prefer contract-first interfaces and stable schemas over hidden coupling.
3. Keep commerce, learning, regulatory, identity, payments, integrations, AI, and infrastructure separable.
4. Represent lifecycle state explicitly; avoid boolean shortcuts for multi-stage workflows.
5. Design write operations to be idempotent where retries are possible.
6. Backward-incompatible contract changes require a versioned migration path.
7. Derived values must trace to authoritative inputs and calculation rules.

## Data Entry & AI Assist

1. All forms are schema-driven: field id, type, label, required state, validation, sensitivity, visibility, help text, and workflow ownership.
2. Validate on both client and server; server validation is authoritative.
3. Never auto-correct legal names, identifiers, dates, money, credentials, or attestations without user confirmation.
4. AI suggestions must be distinguishable from user-entered or externally verified facts.
5. Missing required fields produce deterministic blockers, not guessed values.
6. Sensitive identifiers use dedicated secure fields and are excluded from generic telemetry and public repositories.
7. Every form submission emits a versioned validation result and audit event.
8. Draft, reviewed, ready-for-handoff, submitted, accepted, rejected, and amended states remain distinct.

## Identity, Roles & Access

1. Deny by default and grant least privilege by role and task.
2. Separate customer, student, instructor, facility, reviewer, billing, compliance, admin, and system-worker permissions.
3. High-risk actions require step-up confirmation or human approval where applicable.
4. Service identities may perform only their declared jobs and cannot inherit human administrator privileges.
5. Authorization is enforced server-side on every protected action.
6. Audit identity changes, role grants, privileged actions, and external handoffs.

## Security & Privacy

1. Never commit secrets, passwords, tokens, SSNs, ITINs, full payment data, bank credentials, or government login credentials.
2. Use secret managers or provider environment variables for runtime credentials.
3. Minimize data collection to fields required by the workflow.
4. Encrypt protected data in transit and at rest when persistent storage exists.
5. Use secure cookies/session controls and CSRF protections for authenticated browser writes.
6. Use rate limiting, input size limits, content-type checks, and abuse controls on public endpoints.
7. Security failures fail closed; do not downgrade silently.
8. Logs must redact secrets and protected identifiers.

## Regulatory & Legal Truth Boundaries

1. Prepared is not submitted; submitted is not accepted; accepted is not licensed or approved unless the issuing authority says so.
2. Regulatory deadlines are rule-driven configuration with jurisdiction, provider type, event class, citation, clock, and effective date.
3. HHSC/TULIP, BON, state formation, IRS, USPTO, and similar systems use explicit adapter boundaries.
4. Do not represent approval, accreditation, deficiency-free status, credential validity, or filing success without current evidence.
5. Facility regulatory reporting and individual professional reporting remain separate decision paths.
6. External legal attestations stay with the authorized person or official system.
7. Preserve original records; corrections use amendment/late-entry rules rather than destructive rewriting.

## Commerce, Catalog & Inventory

1. Every sellable item and variant has a unique SKU, canonical name, category, price version, inventory state, media assets, and disclosure metadata.
2. Inventory is ledger/source driven; marketing pages cannot manufacture stock.
3. Prices use integer minor units and explicit currency.
4. Variant dimensions such as size, color, style, and design are normalized rather than encoded only in display text.
5. Clinical or performance claims require manufacturer/source evidence; otherwise use neutral retail descriptions.
6. Images are representative unless tied to an exact product/variant asset record.
7. Checkout cannot represent payment success without processor evidence.
8. Returns, fulfillment, discounts, taxes, and invoices preserve their own immutable event history.

## Learning, Assessment & Competency

1. Programs, modules, assessments, remediation, attendance, and competency evidence are versioned.
2. Internal training status is distinct from regulator-approved education.
3. Instructor/supervisor sign-off gates remain human-controlled where skills or clinical competency require supervision.
4. Assessment scoring is deterministic and auditable.
5. Safety-critical missed questions trigger remediation rules where configured.
6. Unsupervised AI simulation does not provide dangerous medication-administration procedures.
7. Completion certificates never imply licensure, certification, or state approval beyond the program's verified authority.

## AI Assistant Governance

1. Andreaa Chan’nel is always disclosed as an AI assistant/persona, not a human employee or licensed professional.
2. AI output includes an error possibility notice for consequential workflows.
3. AI may retrieve approved policy/registry context before answering operational questions.
4. AI cannot override validation, permissions, regulatory gates, payment gates, or human sign-off.
5. Consequential recommendations expose assumptions and source/evidence status.
6. Prompt and tool boundaries prevent secrets from being echoed into logs or public artifacts.
7. AI actions are classified as suggestion, draft, validation assist, prepared action, or verified tool action.

## API & Integration Engineering

1. OpenAPI contracts are maintained for public and integration endpoints.
2. Validate request and response shapes at service boundaries.
3. External writes require an authenticated, authorized, verified connector that explicitly supports the action.
4. Use correlation ids, idempotency keys for retriable writes, bounded timeouts, and structured errors.
5. Retries use backoff and never duplicate financial, filing, or regulatory actions.
6. Adapters expose capability, cost, direct-write status, required fields, prohibited fields, and human-approval requirements.
7. Webhook/event consumers verify authenticity before state mutation.
8. Provider failure must preserve internal truth and evidence rather than simulate success.

## Page, Router & Transition Engineering

1. Every route declares audience, purpose, authorization boundary, primary action, metadata, loading behavior, error behavior, and disclosures.
2. Use shared layouts and design tokens; avoid page-specific identity drift.
3. Navigation is keyboard accessible, responsive, and preserves semantic landmarks.
4. Transitions are progressive enhancement and respect reduced-motion preferences.
5. Critical forms preserve drafts across safe navigation where feasible.
6. Route prefetching is intentional and must not create unnecessary asset/network churn.
7. Images define dimensions/aspect behavior to minimize layout shift.
8. Public pages meet practical WCAG accessibility requirements for labels, focus, contrast, and semantics.

## Workers, Jobs & Automation

1. Every job has a stable job type, schema, trigger, owner, retry policy, timeout, idempotency strategy, and terminal states.
2. Workers use graceful shutdown and do not abandon in-flight state silently.
3. Retryable, non-retryable, blocked, review-required, and dead-letter outcomes are distinct.
4. Automation that can create legal, financial, regulatory, or clinical consequences requires explicit gates.
5. Free-tier request-driven execution is preferred when paid worker/cron infrastructure is prohibited.
6. Background tasks never become the sole source of truth for externally confirmed outcomes.
7. Scheduled logic records its effective schedule/timezone and last successful evidence.

## Observability & Evidence

1. Use structured logs with service, environment, version, correlation id, event type, and safe error detail.
2. Expose health/readiness checks that test required dependencies without leaking secrets.
3. Production evidence records commit, branch, version, environment, dependency state, and verification time.
4. Operational metrics distinguish latency, availability, error rate, queue depth, and business workflow failures.
5. Audit events are append-oriented and attributable.
6. No dashboard may convert unknown/unverified state into green success.

## Testing & Validation

1. Typecheck and production build are minimum gates for web changes.
2. Unit tests cover deterministic domain rules and validators.
3. Contract tests cover OpenAPI request/response compatibility.
4. Integration tests verify boundary behavior with safe mocks or authorized test systems.
5. Smoke tests verify deployed health and critical read paths.
6. High-risk workflows require regression tests for authorization, validation, redaction, and state transitions.
7. A test that never executed is not a passed test; infrastructure failures are reported separately.
8. Test fixtures never contain real protected personal data.

## Deployment, Release & Rollback

1. Deploy immutable commits; record the exact commit and environment.
2. Use feature/canary/staging before production for substantive changes.
3. Production promotion requires defined release gates and explicit evidence.
4. Schema changes require forward migration and rollback/recovery planning.
5. Rollback restores a known good artifact/configuration without corrupting newer data.
6. Auto-deploy is permitted only where branch/environment intent is explicit.
7. Do not call a service production merely because it is publicly reachable.

## Artifacts, Provenance & Intellectual Property

1. Every release artifact has a type, source, version, checksum/provenance, and release gate.
2. Generated images, logos, documents, binaries, schemas, and contracts are registered with their intended use.
3. Trademark, patent, copyright, domain, and business-registration status are tracked separately.
4. Inventorying an IP asset does not imply registration or legal ownership determination.
5. Do not publish sensitive source artifacts or credentials.
6. User-facing assets must match the current canonical brand and verified product truth.

## Performance & Resilience

1. Set explicit timeouts for network and long-running operations.
2. Cache only data whose staleness tolerance is defined.
3. Critical state survives process restarts only when a durable store is actually configured.
4. Use pagination/streaming for large datasets and avoid unbounded memory growth.
5. Degrade optional features without hiding failure of required dependencies.
6. Capacity assumptions are documented and revisited before production scale.

## Zero-Cost Infrastructure Mandate

1. Do not create, upgrade, purchase, or enable a resource that can incur a charge without explicit later authorization.
2. Paid-only capabilities remain BLOCKED_COST_GATE or CONFIGURATION_ONLY.
3. Government, filing, domain, payment-processing, shipping, tax, and third-party fees remain external and are never represented as waived unless verified.
4. Free-tier limitations such as sleep, non-persistence, quotas, or cold starts are disclosed.
5. Source scaffolding for future paid capabilities may exist but must remain inactive.
6. Cost policy is evaluated before infrastructure mutations and external billable actions.

## Enforcement model

- **Design time:** schemas, contracts, roles, adapters, routes, and rules are versioned in source.
- **Build time:** typecheck, contract validation, tests, and production build enforce code integrity.
- **Runtime:** authorization, validation, redaction, cost, human-approval, external-write, and dependency gates enforce behavior.
- **Release time:** immutable commit, environment, artifact, migration, smoke-test, and rollback evidence control promotion.
- **Audit time:** structured logs and append-oriented events preserve who did what, when, under which rule/version, and with what result.

## Non-negotiable external-system rule

Internal completion never becomes external completion without provider evidence. Examples:

- filing packet prepared ≠ filing submitted;
- filing submitted ≠ accepted;
- invoice created ≠ paid;
- payment intent created ≠ settled;
- credential check requested ≠ credential verified;
- regulatory packet prepared ≠ agency accepted;
- training completed ≠ state license/certification;
- deployment built ≠ production verified.

## AI operating boundary

Andreaa Chan’nel may act as an AI consultation, support, navigation, drafting, explanation, normalization, validation-assist, and workflow-orchestration persona. It must remain visibly identified as AI, may make mistakes, and cannot impersonate a licensed professional, government representative, regulator, or human employee. Required human/legal/regulatory attestations remain with the authorized person.

## Change control

Changes to this doctrine require a version bump, a review of affected APIs/workflows, and regression validation for any altered authorization, validation, privacy, regulatory, payment, or deployment rule.
