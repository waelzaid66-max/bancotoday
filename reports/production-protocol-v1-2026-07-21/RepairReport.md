# Repair Report — WAVE C (scale coherence)

| Field | Value |
|-------|-------|
| Protocol | BANCO STORE Production Execution Protocol v1.0 |
| Repository | `waelzaid66-max/-BANCO-CA-OOM-` |
| Branch | `main` |
| Commit | `5c6e8139ee3a49e54f27823ef6c9e456ced417e6` (`5c6e813`) |
| Author | Cursor agent (production protocol v1.0) |
| Date | 2026-07-21 |
| Stance | ZERO GUESS · ZERO BLIND MERGE · EVIDENCE ONLY |

> **Production verdict:** **NOT DECLARED READY.** Protocol acceptance criteria are not fully satisfied while install/typecheck/lint/live F0–F1 remain blocked or pending.


## Unique ID
`REP-2026-07-21-C1-C3-SCALE`

## Problem Description
1. **C1:** Profile `menuItems` used `useMemo` after early returns → Rules of Hooks crash risk.
2. **C2:** Catalog markets LB/MA/TN/SD lacked map centers → silent Egypt framing.
3. **C3:** No deploy SHA on readiness → cannot pin live traffic (F1).

## Root Cause
1. Hook called conditionally after `!isLoaded` / onboarding returns.
2. Incomplete restore of `marketCountryMapCenter` vs `MARKET_COUNTRIES`.
3. Health routes never exposed build identity; images not baking `GIT_SHA`.

## Files Modified
- `artifacts/banco-mobile/app/(tabs)/profile.tsx`
- `artifacts/banco-mobile/lib/searchTaxonomy.ts`
- `artifacts/api-server/src/routes/health.ts`
- `artifacts/api-server/src/health.test.ts`
- `Dockerfile`, `deploy/gcp/Dockerfile.api`, `deploy/aws/Dockerfile.api`
- `cloudbuild.yaml`, `deploy/gcp/cloudbuild.deploy.yaml`
- `scripts/chain-integrity-gate.mjs`
- `artifacts/banco-mobile/tests/lib-hardening.test.mjs`
- Audit docs under `audit/`

## Impact matrix

| Area | Impact |
|------|--------|
| Database | None |
| API | Additive fields on `/`, `/livez`, `/readyz` only; `/healthz` unchanged OpenAPI |
| Mobile | Profile crash fix; map centers for 4 markets |
| Admin / Dealer / Web / Landing | None (no UI churn) |
| Marketplace | Map framing coherence for LB/MA/TN/SD |
| Security | No new auth surface; SHA pin is non-secret |
| Performance | Negligible (removed useMemo; plain array) |
| Regression risk | Low — surgical; gates lock markers |

## Dependencies
None added.

## Rollback Strategy
`git revert 5c6e813` (or restore prior blobs for listed files). Chain gate will fail if markers regress — intentional.

## Production Validation
- Chain gate: PASS
- Mobile node tests: PASS
- Full pnpm typecheck/lint/build: BLOCKED — requires pnpm install / node_modules
- Live readyz SHA: PENDING — owner F1 (paste live /api/readyz)

## Final Status
**CODE MERGED on main (`5c6e813`) · ENVIRONMENT VALIDATION INCOMPLETE · NOT PRODUCTION-ACCEPTED**

