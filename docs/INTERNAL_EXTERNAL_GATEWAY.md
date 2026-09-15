# Internal-to-External Gateway

## Purpose
The gateway is the software boundary between Comeaux internal records/workflows and external agencies, providers, portals, and user-controlled clients. It is designed to support the organization's required workflows without fabricating external state.

## Core pipeline

`internal record -> adapter selection -> field validation -> sensitive-field redaction -> zero-cost gate -> human/attestation gate -> SHA-256 evidence envelope -> official handoff -> external action -> evidence recording`

The gateway never equates **prepared** with **submitted**, **submitted** with **accepted**, **invoice prepared** with **paid**, **packet prepared** with **licensed/approved**, or **message prepared** with **delivered**.

## Current adapters

| Adapter | Internal capability | External boundary | Direct write |
| --- | --- | --- | --- |
| IRS EIN | SS-4/EIN data preparation and validation | Official IRS EIN process | No |
| Colorado SOS LLC | formation intake, validation, packet hash | Colorado SOS filing portal | No |
| Texas SOS LLC | formation intake and packet preparation | SOSDirect / official state process | No |
| Texas HHSC TULIP | regulatory packet preparation and evidence index | TULIP | No |
| Texas BON | verification task and evidence boundary | Official BON resource | No |
| Stripe | invoice/reconciliation adapter | live payment network | Disabled by $0 rule |
| USPTO trademark | IP inventory and filing packet preparation | USPTO filing system | No |
| Email client | message drafting/handoff | user's email client/provider | No |
| Render runtime | deployment/health planning boundary | separately authorized Render operations | App does not embed credentials |

## Zero-cost operating mandate
`zeroCostOnly` is enforced for gateway execution. Actions classified as billable are returned as `blocked_cost_gate`. Government or provider fees are never silently charged, waived, absorbed, or represented as free unless an official program actually provides that waiver.

Preparation and navigation may remain free while the final external submission is blocked by an external fee.

## Sensitive-data rules
The gateway redacts known secret/sensitive field names before optional evidence persistence. Do not send SSNs, ITINs, passwords, passcodes, API keys, access tokens, full card data, bank/routing information, driver-license numbers, or similar secrets through generic gateway payloads.

For EIN workflows, the responsible party enters SSN/ITIN directly in the IRS-controlled process. For payment workflows, payment credentials belong in a PCI-compliant provider surface rather than this gateway.

## Evidence states
- `draft` — internal work is incomplete.
- `blocked_validation` — required fields are missing.
- `blocked_cost_gate` — requested action can incur an external fee.
- `blocked_external_write` — no verified direct-write API/connector exists.
- `prepared` — internal preparation completed.
- `ready_for_handoff` — official destination may be opened by the authorized user.
- `recorded_unverified` — external evidence was supplied but has not been independently verified.

## Runtime endpoints
- `GET /api/integrations`
- `POST /api/integrations/prepare`
- `POST /api/integrations/handoff`
- `POST /api/integrations/evidence`
- `/integrations` — interactive control console

The API contract is registered at `contracts/internal-external-gateway.openapi.yaml`.

## External-state doctrine
A direct write may be enabled only after all of the following are true:
1. the provider exposes an authorized write API or connector;
2. credentials are stored outside source control;
3. the connector identity and target account are verified;
4. request/response evidence is captured;
5. retry/idempotency rules are implemented;
6. cost is allowed by current policy;
7. regulated actions have the required human attestation/review.

Until then the adapter remains `assisted_handoff`, `resource_link`, or `configuration_only`.

## Compliance boundaries
The gateway is software infrastructure, not a licensed clinician, attorney, regulator, tax professional, or government representative. It can validate internal data, enforce policies, generate packets, create checklists, route users to official systems, and preserve evidence. It does not independently establish legal conclusions, clinical competency, regulatory approval, tax elections, business formation, credential validity, payment settlement, trademark ownership, or patent rights.
