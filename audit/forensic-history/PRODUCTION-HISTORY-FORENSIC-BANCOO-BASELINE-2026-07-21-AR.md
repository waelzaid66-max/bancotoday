# BANCO STORE — FULL PRODUCTION HISTORY FORENSIC INVESTIGATION
## READ-ONLY · ZERO IMPORT · ZERO IMPLEMENTATION · EVIDENCE ONLY

**Investigation date:** 2026-07-21  
**Investigator tip (working clone):** `waelzaid66-max/-BANCO-CA-OOM-` @ `c1cce1b`  
**Owner directive:** Treat **`bancoo`** as production baseline for investigation; recover complete production history; **do not import automatically**.  
**This document does NOT authorize merges, resets, or code changes.**

---

## 0) EXECUTIVE VERDICT (EVIDENCE)

| Claim | Evidence result |
|-------|-----------------|
| `bancoo` contains complete production **history** | **FALSE** — exactly **1 commit**, **0 tags**, history explicitly excluded |
| Claimed source SHA `93f2c7e` | **NOT FOUND** in bancoo, CA-OOM, B-OOM, aws-virgen, or b.deals object DBs |
| Merge-base(`bancoo`, CA-OOM HEAD) | **NONE** — orphan root |
| Tree parity vs CA-OOM on priority systems | **bancoo is missing multiple Jul-21 production repairs present on CA-OOM** |
| Safe automatic action | **NONE** — investigation only; Evidence Cards required before any future import |

**Reconstructed meaning of `bancoo` (from its own memory note):**  
`.agents/memory/github-push-auth-stale.md` documents a **clean handoff pattern** using `git commit-tree` because GitHub secret-scanning blocked pushes of history containing old keys. That produces a **history-stripped snapshot**, not a lineage.

**Therefore:**  
- For **forensic baseline of “what Replit packaged on 2026-07-21 14:34Z”** → use `bancoo@321af02` tree.  
- For **traceable production repair history / tags / continuous line** → use `-BANCO-CA-OOM-` (555 commits, 13 tags, 62 remote branches).  
- Declaring “reset CA-OOM to bancoo” would **destroy** documented repairs (see §5) and the integrity gate — that is a **regression**, not recovery.

---

## 1) REPOSITORY IDENTITY MATRIX

| Repo | Tip SHA | Commits on main | Tags | Pushed | Role by evidence |
|------|---------|-----------------|------|--------|------------------|
| **bancoo** | `321af02` | **1** | **0** | 2026-07-21T14:53Z | Orphan handoff snapshot + SQL dump + 5 unique memory notes |
| **-BANCO-CA-OOM-** | `c1cce1b` | **555** | **13** | 2026-07-21T22:29Z | Continuous engineering + wipe restores + N0–N2/C1–C3 |
| **B-OOM** | `6fce7a3` | 349 | 6 | 2026-07-18 | Tip **contained in** CA-OOM (0 unique commits vs HEAD) |
| **b.deals** | `8f7a63a` | 245 | 1 | 2026-07-11 | Tip **contained in** CA-OOM (0 unique commits) |
| **aws-virgen** | `d386f52` | 248 | 5 | 2026-07-10 | Merge-base with CA; **17 unique** mostly AWS sync/manifest/EB Dockerfile |
| **bancooom** | *(empty)* | 0 | 0 | 2026-07-09 | Intended GCP deploy mirror — **empty**, not a history source |

### Tags (production markers live on CA-OOM / B-OOM / aws — not bancoo)

CA-OOM includes: `v1.0.0-rc.1` … `v1.4.0-stable-2026-07-18`.  
bancoo: **none**.

### File counts (trees)

| | bancoo | CA-OOM |
|--|--------|--------|
| Files (excl .git) | 2015 | 2081 |
| Only in bancoo | **6** | — |
| Only in CA-OOM | — | **72** (mostly Jul-21 audits/reports/scripts) |

**Only in bancoo (complete list):**
1. `.agents/memory/banco-ai-env-fix.md`  
2. `.agents/memory/banco-email-completeness.md`  
3. `.agents/memory/banco-mobile-perf.md`  
4. `.agents/memory/banco-web-export-deploy.md`  
5. `.agents/memory/github-push-auth-stale.md`  
6. `release/banco_dev_dump_2026-07-21.sql.gz` (~198KB gz / ~844KB uncompressed — **QUARANTINE**, secrets/PII policy)

---

## 2) AUTHORSHIP / GENERATOR ATTRIBUTION (CA-OOM since wipe `93b650b`)

| Author | Commits since wipe |
|--------|-------------------|
| Cursor Agent | 138 |
| Banco Group | 68 |
| Replit Agent | 15 |
| cursor[bot] | 11 |
| Wael Zeed | 7 |
| Bancoeg | 2 |

**Wipe event:** `93b650b` is an ancestor of CA HEAD; **238 commits** exist on CA after the wipe.  
bancoo cannot show wipe→restore because it has **no history**.

Notable generators in messages: Cursor surgical restores, Claude handoff/docs, Replit “Published your App” publishes interleaved (publish ≠ SHA proof).

---

## 3) PRIORITY SYSTEMS — BANCOO vs CA-OOM (TREE DIFF)

Legend: **P** present · **M** missing/weaker on bancoo · **S** same · **C** candidate from bancoo unique

### 3.1 Profile save pipeline

| Check | bancoo | CA-OOM | Verdict |
|-------|--------|--------|---------|
| `updateMe` / accountTypeChosen | P | P | Shared |
| `/me.role` authoritative over Clerk metadata | **M** — uses `publicMetadata.role` only | **P** — `meRole \|\| clerkRole` | **CA ahead** (S1) |
| Demote guard (elevated → individual blocked) | **M** | **P** | **CA ahead** (S4) |
| Skip / anti-trap onboarding | Partial (accountTypeChosen) | **P** + `onboard-skip` | **CA ahead** |
| `intent=fi` for FI onboarding | P | P | Shared |
| menuItems hooks-safe plain array | P | P (adopted from bancoo pattern) | Shared pattern |
| Cover photo rationale before OS prompt | **M** | **P** (N2) | **CA ahead** |
| Diff magnitude | — | profile.tsx **+160/−65** vs bancoo | CA larger / more guards |

**Root cause if someone “baselines” to bancoo profile:** Clerk-lag role chrome bugs + demote hole + missing cover rationale return.

### 3.2 Profile image / cover upload

| Check | bancoo | CA-OOM |
|-------|--------|--------|
| Cover URL persistence path | P | P |
| `showCoverRationale` pre-prompt | M | P |

### 3.3 Media upload pipeline

| Check | bancoo | CA-OOM |
|-------|--------|--------|
| Presigned upload + MEDIA_VERIFY | P | P |
| createListing → 503 on MEDIA_VERIFY_RETRYABLE | P | P |
| **updateListing** → 503 on MEDIA_VERIFY_RETRYABLE | **M** (handler lacks catch) | **P** (`fcceaba` / N1.1) |
| Upload controller missing-storage → clear 503 | weaker/absent vs CA | **P** (+16 lines) |

**Evidence:** `listingController.ts` update path — CA has explicit `MEDIA_VERIFY_RETRYABLE` → 503; bancoo update handler does not.

### 3.4 Maps search, pins, geolocation

| Check | bancoo | CA-OOM |
|-------|--------|--------|
| Live engine | Leaflet/OSM WebView | Leaflet/OSM WebView |
| Google Maps as live path | Not live (packages may exist) | Not live |
| `marketCountryMapCenter` | **M** (entire helper absent) | **P** incl. EU + LB/MA/TN/SD |
| Locate-me control | Partial | **P** + `locate_error` deny/timeout |
| `geolocationEnabled` wiring | weaker | **P** |
| mapHtml.ts | smaller | **+59** lines vs bancoo |

### 3.5 Clerk authentication

| Provider | bancoo | CA-OOM | Notes |
|----------|--------|--------|-------|
| Email/password | P | P | Code present; live not re-proven this session |
| Google `oauth_google` | P | P | |
| Apple `oauth_apple` | P | P | |
| Facebook **Login** | **NOT a provider** | **NOT a provider** | `facebook` = social link icon only in both |
| Session / ClerkLoaded concerns | Documented in bancoo memory `banco-web-export-deploy.md` | Related fixes may exist on CA line | Card C-MEM-WEB |

### 3.6 Environment parity

| Item | Result |
|------|--------|
| `.env.example` | **IDENTICAL** (sha compare / diff empty) |
| Root package deps keys | Identical count (6) |
| Mobile package deps keys | Identical count (77) |
| OpenAPI yaml | **IDENTICAL** sha256 |
| DB schema `lib/db/src/schema/index.ts` | **IDENTICAL** sha256 |

**Missing env that is documentation-only (bancoo memory):** AI collision `OPENAI_API_KEY=_DUMMY…` / localhost base URL — ops note, not a repo file delta.

### 3.7 Production deployment

| Item | bancoo | CA-OOM |
|------|--------|--------|
| Dockerfile GIT_SHA bake | M | P |
| readyz `deployPin` gitSha/buildId | M | P |
| `chain-integrity-gate.mjs` | **M** | **P** (36 markers) |
| `EXPO_WEB_BASE_URL` experiments.baseUrl in app.config | **P** | **M** (removed/absent) — **Evidence Card C-WEB-BASE** |
| bancooom sync target | empty | documented + script; still empty remotely |

### 3.8–3.10 Historical / cross-repo / validation

See §1 and §4. Automated cloud validation still BLOCKED on npm install; chain gate on CA **36/36 PASS**.

---

## 4) CROSS-REPO UNIQUE COMMITS

| Direction | Result |
|-----------|--------|
| B-OOM `main` ∖ CA HEAD | **0 commits** |
| b.deals `main` ∖ CA HEAD | **0 commits** |
| CA HEAD ∖ B-OOM | 206 commits |
| CA HEAD ∖ b.deals | 310 commits |
| aws-virgen `main` ∖ CA HEAD | **17 commits** — sync manifests, EB root Dockerfile, AWS package docs |
| CA HEAD ∖ aws-virgen | 324 commits |

**aws-virgen unique = deploy packaging knowledge**, not marketplace feature treasure beyond CA product line.

---

## 5) REPAIRS PRESENT ON CA-OOM THAT NEVER APPEAR IN BANCOO TREE

These are **production fixes that would be LOST** if CA were reset to bancoo:

| ID | Repair | CA evidence |
|----|--------|-------------|
| S1 | `/me.role` authoritative | profile.tsx |
| S2 | Banks awaiting-link UI | banks.tsx `banks-awaiting-link` |
| S4 | Demote blocked | profile demote alerts |
| N1.1 | updateListing MEDIA_VERIFY → 503 | listingController |
| N1.2 | Push/message listingId deep-link hardening | mobile + gates |
| N1.3 | Admin FI awaiting queue filter/CTA | admin-os users |
| N2 | locate_error, keyboard resize, cover/chat rationale | mapHtml, app.json, profile |
| C2 | Map centers LB/MA/TN/SD + EU | searchTaxonomy |
| C3 | Deploy SHA pin | health.ts + Dockerfiles |
| P0 | chain-integrity-gate | scripts/ |

**Partial merges / regression points:** wipe `93b650b`; incomplete restores; bancoo snapshot frozen **before** many of the above landed on CA (or taken from a tree that lacked them).

---

## 6) EVIDENCE CARD BOARD (NO IMPORT YET)

| Card ID | Candidate | Source | Status | Risk |
|---------|-----------|--------|--------|------|
| C-DUMP-01 | `release/banco_dev_dump_2026-07-21.sql.gz` | bancoo only | **QUARANTINE** | Secrets/PII — security owner only |
| C-MEM-AI | `banco-ai-env-fix.md` | bancoo only | KNOWLEDGE | Ops env collision — do not invent code |
| C-MEM-EMAIL | `banco-email-completeness.md` | bancoo only | VERIFY on CA EmailService before any change | May already be present |
| C-MEM-PERF | `banco-mobile-perf.md` | bancoo only | DEFER | FlatList props — needs jank proof |
| C-MEM-WEB | `banco-web-export-deploy.md` | bancoo only | KNOWLEDGE | Clerk origin / double `/api` warnings |
| C-MEM-PUSH | `github-push-auth-stale.md` | bancoo only | META | Explains why bancoo has no history |
| C-WEB-BASE | `EXPO_WEB_BASE_URL` block in app.config.ts | bancoo > CA | **CARD ONLY** | Replit web export path; compatibility check vs CA serve scripts required |
| C-AWS-EB | aws-virgen EB Dockerfile/.ebextensions commits | aws-virgen unique | CARD for AWS lane | Not mobile product |
| C-BANCOO-RESET | Whole-tree baseline swap | — | **REJECT** | Deletes §5 repairs + integrity gate |

**Import rule unchanged:** locate → understand → compare → deps → compatibility → risk → **owner approval** → only then implement.

---

## 7) INVESTIGATION PRIORITIES — STATUS

| # | Priority | Forensic status |
|---|----------|-----------------|
| 1 | Profile save pipeline | Mapped; CA ahead on role/demote; bancoo contributed hooks-safe menu pattern already on CA |
| 2 | Profile image upload | Cover rationale missing on bancoo |
| 3 | Media upload pipeline | updateListing 503 missing on bancoo |
| 4 | Maps | Centers + locate_error missing on bancoo; Leaflet live both |
| 5 | Clerk auth | Google/Apple/Email both; Facebook Login **absent both** (not lost — never provider) |
| 6 | Environment parity | `.env.example` / OpenAPI / schema identical; AI env note is ops memory |
| 7 | Production deployment | CA has SHA pin + gate; bancooom empty; aws-virgen has EB packaging uniques |
| 8 | Missing historical repairs | Listed in §5 (CA has them; bancoo tree lacks them) |
| 9 | Cross-repository comparison | §1 §4 complete for tips |
| 10 | Complete production validation | NOT complete — install/live F1 still BLOCKED in cloud; see laptop matrix |

---

## 8) WHAT “RECOVER COMPLETE PRODUCTION HISTORY” MEANS OPERATIONALY

Because `bancoo` **deleted history by design**, recovery cannot mean “read bancoo git log.”

Recoverable history is the **union**:

1. **CA-OOM git history + tags** (primary timeline),  
2. **bancoo sealed tree** as a 2026-07-21 Replit handoff artifact,  
3. **aws-virgen** deploy-only unique commits,  
4. **B-OOM / b.deals** as older contained snapshots,  
5. **Memory/docs** on bancoo unique notes (cards),  
6. **SQL dump** under quarantine (not git-history).

---

## 9) FORBIDDEN UNTIL OWNER EXPLICITLY APPROVES A CARD

- Reset/merge CA-OOM ← bancoo  
- Blind cherry-picks  
- Feature development / cosmetics  
- Inventing Facebook Login  
- FI auto-create  
- Stay/Cars / SECTION_ROUTE redesign  

---

## 10) NEXT STEPS (STILL NON-IMPLEMENTATION UNTIL APPROVED)

1. Owner acknowledges: bancoo = sealed snapshot ≠ git lineage.  
2. Laptop agent runs validation matrix + F1 readyz (existing paste).  
3. Optionally card-review **C-WEB-BASE** and **C-MEM-EMAIL** (read CA files first).  
4. Sync empty `bancooom` from CA for GCP naming — ops, not history rewrite.  
5. Implementation begins only after this forensic pack is accepted and a numbered Evidence Card is approved.

---

## 11) ARTIFACT PATHS

- This report: `audit/forensic-history/PRODUCTION-HISTORY-FORENSIC-BANCOO-BASELINE-2026-07-21-AR.md`  
- Machine summary: `reports/forensic-history-2026-07-21/ForensicSummary.json`  
- Evidence cards index: `reports/forensic-history-2026-07-21/EvidenceCards.md`
