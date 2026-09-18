# Comeaux Data Entry Engine

## Mandate

Every operational form is registry-driven, versioned, validated, auditable, and explicit about what AI may suggest. AI suggestions never become authoritative facts automatically.

## Processing states

- `empty`
- `entered`
- `suggested`
- `validated`
- `needs_review`
- `blocked`

## Sensitive-data boundary

The generic AI/data-entry layer does not accept or persist passwords, passcodes, API keys, access/refresh tokens, card details, bank/routing details, SSNs, ITINs, driver's-license numbers, or state-ID numbers. Those belong only in the authorized external secure system when required.

## AI assistance

Allowed:
- normalization
- deterministic classification
- safe drafting templates
- missing-field prompts
- validation explanations

Not allowed:
- inventing government identifiers
- claiming an external filing was submitted/accepted without evidence
- clinical diagnosis or unsupervised medication procedure instruction
- legal/tax conclusions presented as professional advice
- silently overwriting a user's authoritative value

## Source of truth

The data-entry engine prepares and validates. External agencies/providers remain the source of truth for their own acceptance, identity verification, regulatory status, payment settlement, credentialing, and filing outcomes.
