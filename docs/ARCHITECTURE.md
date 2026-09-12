# Architecture

## Runtime planes

1. **Web/commerce** — Next.js App Router, catalog ISR, dynamic operational dashboards and route-handler APIs.
2. **LMS** — human-authored course graph, attendance, assessments, grading, remediation, skills sign-off and completion evidence.
3. **Simulation** — scripted deterministic scenarios by default; optional external AI provider adapter after policy/security review.
4. **Data** — PostgreSQL system of record for commerce, education, payments, regulatory handoffs, artifacts and audit events.
5. **Mobile** — native SwiftUI client consuming stable public/authenticated APIs.
6. **Delivery** — GitHub branches/workflows → Render staging/production → Artifact Registry/API Hub release evidence.

## Rendering engines

- Static generation: marketing/academy content.
- ISR: catalog surfaces with bounded revalidation.
- Dynamic SSR: authenticated/operational dashboards.
- Route handlers: JSON APIs, webhooks and integration gateways.
- Native rendering: SwiftUI iOS application.
- Print/PDF pipeline: planned server-side generated catalogs, invoices, receipts, textbooks and workbooks from versioned content artifacts.

## External system principle

An internal record may say `ready_for_transmittal`; it may not say `submitted`, `accepted`, `approved`, `conferred` or `licensed` until the external system or authorized operator provides evidence of that event.
