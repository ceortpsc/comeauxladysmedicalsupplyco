# Colorado LLC Enrollment & Official Filing Handoff

## Purpose

This module provides administrative preparation and validation for Colorado LLC Articles of Organization and then hands the filer to the official Colorado Secretary of State system for final identity verification, payment, attestation, and submission.

It does **not** claim an authorized direct-write Colorado state API.

## Current official-source rules modeled

- LLC name must be distinguishable and include an accepted LLC designator.
- Principal office requires a physical street address.
- Registered agent must have a Colorado physical address and consent to appointment.
- Effective July 1, 2025, an individual registered agent must verify Colorado residency using a Colorado driver license/ID or the SOS alternate mailed-passcode process; an entity registered agent must be registered and in good standing.
- Filing must specify whether management is vested in members or managers.
- Filing must confirm at least one member.
- Organizer/filer name and mailing address are required.

## Fee-relief status

HB22-1001 / the Colorado Business Fee Relief Act was temporary. Colorado's own reporting states that LLC filing fees were reduced from $50 to $1 and trade-name registrations from $20 to $1, affecting filings in calendar years 2022 and 2023. The product therefore defaults the fee-relief gate to **inactive** unless a current official Colorado SOS source is verified.

The UI must never market a $0 or $1 state fee merely because the historical program existed.

## Security boundary

The public repository contains no customer-specific application data.

Do not collect or persist in this module:

- SSN or ITIN
- EIN responsible-party identifier
- Colorado driver-license/ID number
- Colorado SOS credentials
- payment-card data

The registered-agent identity number, where required, belongs directly in the Colorado SOS filing flow.

Database storage uses encrypted application payloads plus non-sensitive metadata. The state confirmation number and Colorado entity ID may be recorded after the filer reports or verifies successful submission.

## Workflow

1. Draft application
2. Validate required Colorado fields
3. Verify current fee/fee-relief status
4. Generate packet ID + SHA-256 integrity hash
5. Open official Colorado SOS `File a Form` flow
6. User selects `Limited liability company (LLC)`
7. User completes state-only registered-agent identity verification
8. User reviews live state fee and legal attestations
9. User pays and submits directly to Colorado SOS
10. Application status is updated only after official confirmation is available

## Status model

- `draft`
- `validated`
- `ready_for_handoff`
- `submitted_external`
- `accepted`
- `rejected`
- `withdrawn`

## API

- `POST /api/business-filings/colorado/llc/validate`
- `POST /api/business-filings/colorado/llc/handoff`

The handoff endpoint is intentionally explicit that it has **not** submitted a government filing.

## Official endpoints

- Business home: `https://www.coloradosos.gov/pubs/business/businessHome.html`
- New filing selector: `https://www.coloradosos.gov/biz/FileDoc.do`
- Name availability: `https://www.coloradosos.gov/biz/NameCriteria.do`
- Registered-agent changes: `https://www.coloradosos.gov/pubs/business/RAchanges.html`

## Legal posture

This is filing-preparation and administrative workflow software, not legal advice. State acceptance is controlled exclusively by the Colorado Secretary of State.
