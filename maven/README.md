# Maven / JVM build plane

The Comeaux monorepo is intentionally polyglot. Next.js/Node remains the primary storefront/LMS runtime; Maven manages JVM services and shared regulated-backend contracts.

## Modules

- `platform-contracts` — dependency-light records/enums shared by JVM services.
- `regulatory-gateway` — Spring Boot service for server-side regulatory validation and future state/provider adapters.

## Requirements

- Java 21+
- Maven 3.9.6+

## Commands

```bash
mvn -B -ntp verify
mvn -B -ntp -pl maven/regulatory-gateway -am test
mvn -B -ntp -pl maven/regulatory-gateway -am package
```

From the repository root you can also use:

```bash
npm run maven:test
npm run maven:verify
npm run verify:all
```

## Runtime

The regulatory gateway exposes Spring Boot Actuator health at `/actuator/health` and the Colorado validation endpoint at `/v1/business-filings/colorado/llc/validate`.

The gateway validates/prepares data only. It must not claim an official state submission or acceptance unless a government system confirms that event.
