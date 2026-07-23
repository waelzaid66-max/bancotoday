# BANCO STORE — PRODUCTION MAIN ENGINE (bancoo)
## PHASE 1–2 AUDIT + SYNC PLAN · ZERO BLIND MERGE · ZERO FEATURE LOSS

**Date:** 2026-07-21  
**Working clone executing docs:** `-BANCO-CA-OOM-` @ **`76ead31`** (pull before sync)  
**Owner-declared MAIN target:** `waelzaid66-max/bancoo`  
**Cloud agent push to bancoo:** **DENIED** (GitHub `permissions.push=false`) → sync must run on **laptop/owner PAT**

---

## 0) CRITICAL HONESTY (EVIDENCE)

| Fact | Evidence |
|------|----------|
| Current `bancoo` tip | `321af02` — **1 commit**, **0 tags**, orphan, claimed source `93f2c7e` **not found** anywhere |
| Current verified repair line | `-BANCO-CA-OOM-` `76ead31` — 555+ commits, 13 tags, chain **39/39**, includes Jul-21 repairs **and** bancoo web stack re-import (C-WEB-BASE) |
| Making bancoo MAIN by resetting CA → bancoo tip | **FORBIDDEN** — loses `/me.role`, demote, updateListing 503, map centers, chain gate, FI awaiting, deploy pin, etc. |
| Making bancoo MAIN correctly | **Sync verified CA tip → bancoo**, preserving bancoo-only sealed dump + memory notes |

**Definitive production tree content (evidence-backed) = CA tip (superset) + bancoo sealed uniques.**

---

## PHASE 1 — Repository Audit (understanding only)

### Architecture (both trees share monorepo shape)

| Layer | Path |
|-------|------|
| API | `artifacts/api-server` |
| Mobile | `artifacts/banco-mobile` |
| Admin / Dealer / Web / Landing | `artifacts/admin-os`, `dealer-os`, `banco-web`, `landing`, `banco-website` |
| DB | `lib/db` |
| Contracts | `lib/api-spec`, `api-zod`, `api-client-react` |
| Deploy | `Dockerfile`, `cloudbuild.yaml`, `deploy/gcp`, `deploy/aws` |

### Identical between bancoo@321af02 and CA (selected)

- `.env.example`
- `lib/api-spec/openapi.yaml`
- `lib/db/src/schema/index.ts`
- Root + mobile dependency **key sets** (counts match)

### bancoo-only (must preserve on sync)

1. `release/banco_dev_dump_2026-07-21.sql.gz` — **QUARANTINE**
2. `.agents/memory/banco-ai-env-fix.md`
3. `.agents/memory/banco-email-completeness.md`
4. `.agents/memory/banco-mobile-perf.md`
5. `.agents/memory/banco-web-export-deploy.md`
6. `.agents/memory/github-push-auth-stale.md`

### CA-only (must land on bancoo to avoid feature loss)

- `scripts/chain-integrity-gate.mjs` (+ all Jul-21 audits/reports)
- Profile `/me.role`, demote guard, cover rationale
- Banks awaiting-link
- updateListing MEDIA_VERIFY → 503
- Map centers + locate_error
- deployPin on readyz
- Admin FI queue N1.3
- C-WEB-BASE already on CA (from bancoo) — will round-trip cleanly

---

## PHASE 2 — Historical Comparison (reference repos)

| Repo | Tip | vs CA HEAD | Role |
|------|-----|------------|------|
| bancoo | `321af02` | orphan / no merge-base | Declared MAIN **target**; content must be upgraded |
| B-OOM | `6fce7a3` | contained | Reference ancestor |
| b.deals | `8f7a63a` | contained | Reference ancestor |
| aws-virgen | `d386f52` | 17 unique deploy commits | AWS packaging knowledge — not blind-imported |
| bancooom | empty | n/a | GCP **name** mirror — separate sync script |

Author mix on CA since wipe: Cursor Agent dominant, plus Banco Group, Replit Agent, cursor[bot].

---

## PHASE 3 — Evidence for sync (not optional rewrite)

**Root cause of “bancoo is not production-complete today”:**  
handoff used `commit-tree` (see `github-push-auth-stale.md`) → history + later repairs absent.

**Production impact if left as-is:** profile role lag, upload update 500s, wrong map framing, no integrity gate, QR-only browsers if web path regresses.

**Required validation after sync (laptop):**

```bash
CONFIRM_BANCOO_FORCE=YES BANCOO_PRODUCTION_SYNC_TOKEN=ghp_... \
  ./scripts/publish-bancoo-production-main.sh

# Then on bancoo clone:
node scripts/chain-integrity-gate.mjs   # expect 39/39
pnpm install --frozen-lockfile
node scripts/laptop-validation-matrix.mjs --with-install
```

---

## EXECUTION STATUS (this cloud session)

| Step | Status |
|------|--------|
| Phase 1 audit | **PASS** (documented) |
| Phase 2 compare | **PASS** (documented) |
| Phase 3 evidence | **PASS** (documented) |
| Sync push to bancoo | **BLOCKED** — agent token `push:false` |
| Typecheck/lint/build | **BLOCKED** — npm registry ECONNRESET |
| Runtime production proof | **BLOCKED** — needs deploy + F1 |
| Declare definitive MAIN live | **NO** until sync + validation matrix + runtime |

---

## OWNER / LAPTOP ACTION (unblocks MAIN)

Paste: `audit/handoff/PASTE-CURSOR-LAPTOP-AGENT-BANCOO-PRODUCTION-MAIN-AR.md`

Script: `scripts/publish-bancoo-production-main.sh`
