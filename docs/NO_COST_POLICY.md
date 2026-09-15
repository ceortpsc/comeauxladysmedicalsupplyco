# Zero-Cost Infrastructure Policy

## Mandate
Comeaux Lady's Medical Supply Co. must operate under a **$0 / no-charge / no-cost** infrastructure policy unless an authorized owner explicitly changes this policy in writing.

## Hard rules
1. Do not create, upgrade, purchase, subscribe to, or enable any resource that can incur a charge.
2. Do not convert a free service to a paid tier automatically.
3. Do not attach a billable add-on, persistent disk, paid database, paid worker, paid cron job, paid workflow compute, paid API plan, paid domain, paid certificate, paid storage tier, or paid monitoring product without explicit approval.
4. Where a feature normally requires a paid resource, keep the implementation in source code but mark the runtime state `BLOCKED_COST_GATE` or `CONFIGURATION_ONLY`.
5. Prefer free-tier, local, deterministic, on-demand, or request-driven alternatives.
6. Free resources that can expire, sleep, reset, lose data, or have quotas must be disclosed in the runtime evidence model.
7. No code or UI may claim production durability, high availability, guaranteed persistence, continuous background execution, or regulator submission when the free infrastructure cannot support that claim.
8. Stripe/payment integrations may remain code/configuration-ready, but do not create paid products or incur third-party charges as part of infrastructure setup.
9. Government filing fees, domain registration fees, regulator fees, and third-party fees are external customer costs and must never be represented as waived unless the issuing authority currently confirms a waiver.
10. Any future cost-bearing action requires a separate explicit authorization naming the resource and expected charge.

## Free-tier operating substitutions
- Background refresh jobs -> on-demand request-driven refresh when possible.
- Paid cron -> request-triggered or operator-triggered execution.
- Paid worker -> keep worker code deployable but inactive; use safe synchronous/on-demand fallback for non-critical tasks.
- Dedicated paid Postgres -> remain blocked until a free isolated database is available; never reuse an unrelated project's database.
- Persistent paid queue -> free Key Value may be used only for non-critical ephemeral work with loss-of-data disclosure.
- Paid monitoring -> built-in health endpoints, logs, deployment evidence, and free platform metrics.

## Runtime states
`FREE_ACTIVE`, `FREE_LIMITED`, `CONFIGURATION_ONLY`, `BLOCKED_COST_GATE`, `DISABLED`, `EXTERNAL_FEE_REQUIRED`.

## Enforcement
Deployment manifests, scripts, and runbooks must fail closed when a requested resource is not demonstrably free. A failed free-tier provisioning attempt must not be retried on a paid plan automatically.
