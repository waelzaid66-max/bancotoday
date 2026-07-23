# BANCO STORE — PRODUCTION FORENSIC MASTER PLAN
## ZERO-GUESS · ZERO-LOSS · PRODUCTION-FIRST · NO IMPORT YET

**Date:** 2026-07-21  
**Investigation mode:** READ-ONLY (no merge · no cherry-pick · no copy · no refactor · no dependency change)  
**Workspace clone:** `waelzaid66-max/-BANCO-CA-OOM-` @ **`df37939`** (= `origin/main`)  
**Chain integrity @ investigation tip:** **34/34 PASS**

---

## 0) MISSION LOCK (this phase)

| Allowed | Forbidden (absolute) |
|---------|----------------------|
| Investigate remotes, commits, tags, docs, trees | Merge / cherry-pick / overwrite |
| Compare SHAs, diff --stat, ls-remote | Copy “best of” into production without gate |
| Document evidence cards | Dependency upgrades, cleanup, formatting |
| Rank candidates for **later** import review | AI speculation as fact |
| Ask for live `/status` / deploy SHA | Automatic “final production edition” by merging |

**Nothing is imported in this document. This is the forensic spine only.**

---

## 1) PRIMARY TRUTH — EVIDENCE vs OWNER LABEL

### Owner mandate (this brief)
> Primary repository (source of truth): **bancoo**  
> Others = knowledge only.

### Evidence in this environment

| Repo | Tip SHA | History vs CA-OOM HEAD | Configured remote here? | Role by evidence |
|------|---------|------------------------|-------------------------|------------------|
| **-BANCO-CA-OOM-** | `df37939` | continuous line; **549** commits not in bancoo | **YES** (`origin`) | **Active engineering line** + wipe restores + N0–N2 gates |
| **bancoo** | `321af02` (2026-07-21) | **orphan root commit**; message claims source `93f2c7e` (not found on CA-OOM); **0** shared merge-base with HEAD | NO (fetched temp only, then deleted) | **History-stripped handoff dump** + optional `release/banco_dev_dump_*.sql.gz` |
| **bancooom** | empty repo | n/a | NO | Name used in GCP deploy docs; **not** interchangeable with `bancoo` |
| **B-OOM** | `6fce7a3` | tip **contained** in CA-OOM (0 unique product treasure) | NO | Knowledge / ancestor |
| **b.deals** | `8f7a63a` | tip contained (0 unique) | NO | Knowledge / ancestor |
| **aws-virgen** | `d386f52` | merge-base ancestor of HEAD; **17** unique mostly sync/manifest | NO | AWS deploy mirror (stale) |

### Critical tree finding (temp fetch, no merge)

Turning HEAD → bancoo tip would **delete** (among others):

- `scripts/chain-integrity-gate.mjs` (anti-wipe P0)
- All Jul-21 production audits (N0–N2, accounts, pollution, cross-repo)
- And **regress** surgical profile/upload work relative to HEAD (diff shows profile/uploadController shrinking toward bancoo)

bancoo uniquely adds (approx):

- Several `.agents/memory/*` notes  
- `release/banco_dev_dump_2026-07-21.sql.gz` (DB dump artifact — secrets policy must be reviewed before any use)

### POLICY CONFLICT (must resolve before any import)

| Claim | Support |
|-------|---------|
| “bancoo = production primary” | Owner brief (this message) |
| “CA-OOM = development source of truth; mirrors ≠ feature restore” | `audit/CROSS-REPO-*`, `NEXT-WAVE-*`, `DUAL_REPO_STATUS.md`, `BANCO_MASTER_REFERENCE.md` |
| “bancooom = GCP canonical deploy name” | `deploy/gcp/BANCOOOM_CANONICAL_DEPLOY.md` |

**Forensic rule until owner resolves naming:**

1. Treat **CA-OOM `main @ df37939`** as the **working investigation baseline** (only remote present; continuous repair history).  
2. Treat **bancoo `321af02`** as a **knowledge snapshot** requiring full evidence cards before any file-level adoption.  
3. Treat **bancoo ≠ bancooom**.  
4. **DO NOT** reset/merge CA-OOM to bancoo — that would be **feature/repair LOSS**, not gain.

---

## 2) GLOBAL REPOSITORY STRUCTURE (this baseline)

| Layer | Location | Notes |
|-------|----------|-------|
| Monorepo | pnpm + turbo | `artifacts/*`, `lib/*` |
| Mobile | `artifacts/banco-mobile` | Expo / RN |
| API | `artifacts/api-server` | Express + OpenAPI/zod |
| DB | `lib/db` | Drizzle + PostgreSQL |
| Admin | `artifacts/admin-os` | Vite staff |
| Market | `artifacts/dealer-os` | Dealer OS |
| Landing / website | `artifacts/landing`, `banco-website` | Domain router + Next consumer |
| Deploy | `Dockerfile`, `cloudbuild.yaml`, `deploy/gcp`, `deploy/aws`, `eas.json`, `.github/workflows` | Multi-target |
| Integrity | `scripts/chain-integrity-gate.mjs` (34 checks), `production-confidence-check.mjs` | Anti-wipe |

---

## 3) HISTORICAL FORENSICS — TIMELINE (evidence)

| When | SHA / event | What | Production implication |
|------|-------------|------|------------------------|
| ≤ Jul 10–11 | tags `v1.1.x-production-*` | Stabilization tags on line | Snapshot markers |
| Jul 13 | **`93b650b`** Author Bancoeg — “Auto-seed…” ~144 files | **Mega-wipe** reintroduced baseline UX; silent loss of surgical fixes | Root cause of “fixed then gone” |
| Post-wipe | `26c80e9` etc. | Partial restores | Incomplete |
| Jul 17–18 | tags `v1.2`–`v1.4` stable | Line continues | |
| Jul 21 AM | Cross-repo / anatomy audits | Document CODE vs ENV vs DEPLOY | |
| Jul 21 | `340392f` → `ea74795` → `1dfe613` → accounts `5a67b27` → N0–N2 `df37939` | Surgical restores + gates | **Present on CA-OOM main** |
| Jul 21 14:34Z | bancoo `321af02` | Orphan handoff dump (source claim `93f2c7e` unverified) | Knowledge only until carded |
| Ongoing | Replit “Published your App” commits interleaved | Runtime publishes ≠ proof of SHA | Need live `/status` |

**Commits since wipe on this line:** ~**235** (`93b650b..HEAD`).

### Branches of interest (CA-OOM remote only — do not merge)

| Branch | Forensic note |
|--------|----------------|
| `origin/cursor/booking-notif-test-contract-4322` | Explicit **do not merge** without contract (large unique history risk) |
| `claude/*` inventory/handoff | Mostly docs; not newer product treasure than `main` |
| `cursor/website-phase*` | Website track; separate from mobile core |
| `maintenance/wave-*` | Historical maintenance lanes |

---

## 4) PRIORITY SYSTEMS — EVIDENCE MATRIX (baseline = CA-OOM `df37939`)

### P1 — PROFILE SYSTEM → **PRESENT** (product gaps deferred)

| Capability | Status | Evidence anchors |
|------------|--------|------------------|
| Personal / Business / Company / FI types | PRESENT | profile gate + `UserService` role map |
| Avatar / Cover | PRESENT | Clerk image + cover upload + **cover rationale** (N2) |
| Verification | PRESENT | `verification.tsx`; KYC = boolean |
| Permissions / completeness | PRESENT | completion nudge; phone MOB-01 |
| Role SoT | PRESENT | `/me` preferred (`5a67b27`); Clerk sync best-effort |
| FI awaiting admin link | PRESENT | banks + admin queue (N1.3) |
| Multi-state KYC / auto FI create / Facebook | MISSING (product) | Explicitly deferred — **not import targets** |

**Historical repairs (this line):** touch menus `340392f`; Skip/anti-trap `ea74795`; S1/S2/S4 `5a67b27`; cover rationale `df37939`.

### P2 — MEDIA SYSTEM → **PRESENT** (create) / **PARTIAL** (edit UI)

| Capability | Status | Evidence |
|------------|--------|----------|
| Presign / PUT / verify / promote | PRESENT | `lib/upload.ts`, `uploadController` |
| Storage missing → 503 | PRESENT | `P-upload-503-storage` (`340392f` class) |
| IDOR claims | PRESENT | `P-upload-claims-idor` |
| Create+update verify → 503 | PRESENT | N1.1 `P-upload-update-503` |
| Edit listing media UI | MISSING (dead) | `ListingMediaEditor.tsx` **unimported** |
| Live byte path | Ops | ENV Object Storage — not a git merge |

**DO NOT IMPORT:** treating dead `ListingMediaEditor` as live without wiring review.

### P3 — MAP SYSTEM → **PRESENT** (Leaflet stack — not Google live)

| Capability | Status | Evidence |
|------------|--------|----------|
| Map engine in product | **Leaflet + OSM in WebView** | `mapHtml.ts` / `SearchResultsMap.tsx` |
| Google Maps / RN Maps packages | PRESENT in package.json | **Zero TS product imports** — do not assume Google is live |
| Clustering | PRESENT | MarkerCluster + `GET /search/map` |
| Locate-me | PRESENT + deny Alert | `P-map-locate-me`, `P-map-locate-error` (N2) |
| Market country center | PRESENT | `1dfe613`, `P-map-market-center*` |
| Near-me | PRESENT native / null web | by design |
| Radius UI / nearest sort / full web clusters | DEFERRED | product decisions |

### P4 — AUTHENTICATION → **PRESENT** / Facebook **MISSING**

| Capability | Status | Evidence |
|------------|--------|----------|
| Clerk email OTP | PRESENT | profile signup |
| Google / Apple SSO | PRESENT | `oauth_google` / `oauth_apple` |
| Facebook | **MISSING** | no `oauth_facebook` in app code |
| Session / logout | PRESENT | Clerk |
| RBAC staff | PRESENT | admin-os permissions |
| Role sync | PRESENT | DB SoT + Clerk mirror |

### P5 — SEARCH → **PRESENT**

Global + section FilterSheet + facets; Arabic maps in SearchService; feed ranking; map search. Deferred: `sort=nearest`.

### P6 — MARKETPLACE → **PRESENT**

Cars / RE / Industrial / Materials / Stay booking / B2B RFQ+supply; listing lifecycle; section mini-apps via `SECTION_ROUTE` (anti-melt). Owner compact Stay/Car locked.

### P7 — DEPLOYMENT → **PRESENT** (multi-target) / **Ops truth UNKNOWN**

| Target | Artifacts | Gap |
|--------|-----------|-----|
| Replit | `.replit`, publish commits | Publish ≠ SHA proof |
| GCP Cloud Run | `cloudbuild.yaml`, `deploy/gcp`, name **bancooom** | Need live revision SHA |
| AWS | `deploy/aws`, aws-virgen tip stale | Need EB/ECR label |
| Expo/EAS | `eas.json`, `app.json` | ASB/iOS device proof |
| CI | `.github/workflows/*` | green ≠ production pin |

**BLOCKER for “definitive production edition”:** live production SHA from `/status` or cloud console — **not yet captured in this investigation**.

---

## 5) REQUIRED EVIDENCE CARD (template — empty until filled)

For **every** candidate repair before import:

```
Repository:
Branch:
Commit:
Date:
Author:
Files:
Dependencies:
Purpose:
Root cause:
Related repairs:
Production status: (shipped / never shipped / unknown)
Migration requirements:
Risk level: (L/M/H)
Compatibility: (API / DB / Mobile / Admin)
Regression risk:
Diff vs baseline df37939:
Gate impact: (chain-integrity markers)
Owner approval:
```

**WITHOUT a completed card → DO NOT IMPORT.**

---

## 6) BEFORE ANY MERGE — GATE CHECKLIST

Candidate may be **considered** only if:

- [ ] Architecture review (which layer / mini-app)  
- [ ] Dependency review (no silent upgrades)  
- [ ] Production compatibility (API + DB migrations)  
- [ ] UI compatibility (Stay/Car compact · SECTION_ROUTE)  
- [ ] Mobile Android + iOS QA plan  
- [ ] Security (upload IDOR, FI AuthZ, demote)  
- [ ] Performance note  
- [ ] Build validation  
- [ ] `node scripts/chain-integrity-gate.mjs` stays green (or markers intentionally extended)  
- [ ] Explicit owner approval of **target primary repo name**

---

## 7) CANDIDATES RANKED (knowledge only — NOT approved for import)

| Rank | Candidate | Why interesting | Why NOT import now |
|------|-----------|-----------------|--------------------|
| K1 | CA-OOM `main` continuous line | Has wipe restores + N0–N2 | Already baseline |
| K2 | bancoo `321af02` dump | DB dump + memory notes | Orphan history; would **drop** gates/audits; unknown vs live prod |
| K3 | aws-virgen unique sync commits | Deploy manifests | Not product treasure |
| K4 | booking-notif-test-contract branch | Possibly large experiments | Explicit merge ban until contract |
| K5 | B-OOM / b.deals | Historical | 0 unique vs HEAD |

---

## 8) NEXT INVESTIGATION STEPS (still zero merge)

### Phase F0 — Owner naming lock (blocking)
Answer in writing which is **production primary**:

A) `-BANCO-CA-OOM-` · B) `bancoo` · C) `bancooom` · D) other SHA from live `/status`

### Phase F1 — Production pin
Capture live:

- API `/status` (or equivalent) SHA / build id  
- Cloud Run revision / AWS EB label / Replit publish id  
- Compare to `df37939` and `321af02`

### Phase F2 — bancoo file-level inventory (read-only)
For each path unique on bancoo (memory notes, SQL dump):

- Fill evidence card  
- Security review of SQL dump (PII/secrets)  
- Decide **keep as artifact** vs **never touch**

### Phase F3 — Priority deep dives (one system per report)
Order: **P7 pin → P2 live upload Ops → P1 profile device QA → P3 map device → P4 Facebook decision → P5/P6 only if device fails**

### Phase F4 — Import board (only after F0–F3)
Create `IMPORT-BOARD` with Approved / Rejected / Deferred — still no auto-merge.

---

## 9) ZERO-LOSS RULE

If a candidate tree **removes** any of:

- `chain-integrity-gate` markers  
- Skip / anti-trap / FI intent / demote  
- upload 503 / IDOR  
- SECTION_ROUTE / Stay 30×30 / car compact strip  
- locate-me / market center  

→ **REJECT** as production candidate unless a superior equivalent is proven with device + API evidence.

**bancoo tip currently fails this zero-loss test vs CA-OOM HEAD** (would delete the gate and regress several repairs).

---

## 10) FINAL OBJECTIVE (status)

| Goal | Status |
|------|--------|
| Complete multi-repo investigation | **PARTIAL** — CA-OOM full; others tip-compared; live prod SHA missing |
| Reconstruct most complete stable edition | **NOT STARTED as merge** — correctly blocked |
| Zero duplicated / conflicting architectures | Requires F0 + F1 first |
| Evidence-not-assumptions | **THIS DOCUMENT** |

---

## APPENDIX — Commands used (reproducible)

```bash
git remote -v
git rev-parse HEAD
git ls-remote https://github.com/waelzaid66-max/bancoo.git HEAD
# temp only:
git fetch https://github.com/waelzaid66-max/bancoo.git main:refs/tmp/bancoo-main
git merge-base HEAD refs/tmp/bancoo-main   # empty = orphan
git rev-list --count HEAD ^refs/tmp/bancoo-main   # 549
git rev-list --count refs/tmp/bancoo-main ^HEAD   # 1
git update-ref -d refs/tmp/bancoo-main
node scripts/chain-integrity-gate.mjs      # 34/34
```

---

**Investigator note:** This workspace’s only configured remote is **CA-OOM**. A mandate that “bancoo is primary” is recorded and **not obeyed as a merge instruction** until F0+F1 prove that live production actually runs bancoo `321af02` and that adopting it does not destroy verified repairs.
