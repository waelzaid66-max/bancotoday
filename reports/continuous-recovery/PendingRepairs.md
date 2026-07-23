# Pending Repairs

| Field | Value |
|-------|-------|
| Commit | `e4c8118337c79ce5591f99c638cd8608a8717bc8` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


1. Laptop/owner: `CONFIRM_BANCOO_FORCE=YES` + `./scripts/publish-bancoo-production-main.sh` (bancoo MAIN)
2. Laptop: `pnpm install --frozen-lockfile` + typecheck/lint/build + `laptop-validation-matrix.mjs --with-install`
3. Owner: sync bancooom + deploy + paste readyz (F1)
4. Laptop: device N2 QA + audit `PASTE-CURSOR-LAPTOP-AGENT-WAVE-MEDIA-IDENTITY-GATES-AR.md`
5. Laptop: confirm no store listing already under `com.bancoboom.app` before shipping new package id
6. Owner-only if desired: enable Facebook in Clerk+Meta (do **not** stub)
7. Owner-only: FI org create/link ops runbook execution (no auto-create)
8. Optional: Expo slug rename `bancoboom` → brand slug (EAS continuity decision)
9. Runtime prove web export on Replit after deps available

