# Architecture Report

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


## Layers (evidence: repo tree @ `5c6e813`)

| Layer | Path | Role |
|-------|------|------|
| API | `artifacts/api-server` | Express + OpenAPI/zod |
| Mobile | `artifacts/banco-mobile` | Expo / React Native |
| Admin OS | `artifacts/admin-os` | Staff console |
| Dealer OS | `artifacts/dealer-os` | Seller workspace |
| Banco Web | `artifacts/banco-web` | Web consumer |
| Website | `artifacts/banco-website` | Marketing/site |
| Landing | `artifacts/landing` | Domain router / landing |
| DB | `lib/db` | Drizzle schema |
| Contracts | `lib/api-spec`, `lib/api-zod`, `lib/api-client-react` | OpenAPI → clients |
| Shared | `lib/taxonomy`, `lib/search-contract`, `lib/design-tokens` | Shared truth |

## Non-negotiable architecture rules (active)

- `/me.role` is authoritative over Clerk `publicMetadata` for chrome.
- Maps live path = Leaflet/OSM WebView (not invent Google Maps path).
- Stay/Cars compact UX + `SECTION_ROUTE` isolation locked by chain gate.
- FI membership is admin-linked — **no auto-create**.
- Deploy pin: `GIT_SHA` / `BUILD_ID` exposed on `/api/readyz` (not on strict `/api/healthz` OpenAPI shape).

## Architecture validation status

| Check | Status |
|-------|--------|
| Monorepo layout present | PASS |
| Chain integrity (36 markers) | PASS |
| Cross-repo bancoo whole-tree as primary | REJECTED by forensic evidence (see RepositoryDiff) |
| Full build graph typecheck | BLOCKED — requires pnpm install / node_modules |

