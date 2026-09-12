# Branch governance

- `main` — production-only, protected target.
- `release` — signed release candidate.
- `staging` — integrated pre-production environment.
- `qa` — automated/manual QA acceptance.
- `develop` — working integration branch.
- `feature/*` — scoped product work.
- `chore/*` — infrastructure/build/dependency work.
- `docs/*` — documentation-only work.
- `hotfix/production` — emergency production correction lane.

Promotion sequence: feature → develop → qa → staging → release → main.

Never force-update `main` for normal delivery. Production changes should arrive through reviewed promotion with build/test evidence.
