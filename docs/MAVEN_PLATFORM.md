# Maven Platform Architecture

## Purpose

Maven is the JVM build plane for Comeaux Lady's Medical Supply Co. It complements, rather than replaces, the npm workspace.

## Boundary

- Node/Next.js: customer UI, LMS UI, account surfaces, BFF/API routes.
- Maven/Java: regulated validation services, durable integration gateways, shared JVM contracts, future worker/services.
- PostgreSQL: authoritative application data where provisioned.
- OpenAPI: cross-runtime contract boundary.

## Current reactor

`comeaux-enterprise-parent`

1. `platform-contracts`
2. `regulatory-gateway`

## Governance

The Maven build uses Java 21, requires Maven 3.9.6+, runs Enforcer, Surefire tests, and a Spring Boot packaging step. CI must run `mvn verify` before JVM changes are promoted.

The Colorado gateway is an assisted-validation service. It does not constitute Colorado Secretary of State submission, registered-agent verification, entity acceptance, or fee-waiver approval.
