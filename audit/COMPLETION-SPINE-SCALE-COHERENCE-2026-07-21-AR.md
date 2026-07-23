# BANCO — COMPLETION SPINE (SCALE + COHERENCE)
## ZERO-GUESS · SURGICAL ONLY · NO BLIND MERGE · PRODUCTION-GRADE CONTINUITY

**Date:** 2026-07-21  
**Baseline before this wave:** `c7ba890` (forensic master plan) on `main`  
**Working clone:** `-BANCO-CA-OOM-`  
**Stance:** study → evidence → surgical fix → gate → stop for owner F0/F1

---

## 0) OWNER ASK (this wave)

> افحص واستكمل صح — ضمان كامل لنجاح المشروع، ملايين المستخدمين، دول كتير، تناغم كامل.

**Translation into engineering:** complete **evidenced** gaps that break coherence/scale honesty — **not** redesign, **not** bancoo whole-tree import, **not** invent features.

---

## 1) WHAT WAS COMPLETED (this wave) — EVIDENCE

| ID | Gap | Evidence | Fix | Risk if skipped |
|----|-----|----------|-----|-----------------|
| **C1** | Profile `menuItems = useMemo(...)` **after** early returns (`!isLoaded`, `needsAccountType`) | Rules of Hooks violation → intermittent crash on auth/onboarding flips; bancoo tip used plain array | Plain `const menuItems: …[] = […]` | Signed-in profile crash under load |
| **C2** | `MARKET_COUNTRIES` includes **LB/MA/TN/SD** but `marketCountryMapCenter` lacked them → silent **EG** framing | Catalog vs map center mismatch | Centers for LB/MA/TN/SD | Wrong map frame for 4 markets |
| **C3** | No deploy SHA on readiness → cannot pin live traffic (F1) | Forensic plan F1 | `deployPin()` on `/api`, `/api/livez`, `/api/readyz`; bake `GIT_SHA`/`BUILD_ID` in Dockerfiles + Cloud Build args; `/api/healthz` stays strict OpenAPI `{status}` | Ops cannot prove which SHA is live |
| **C4** | Gates under-specified for C1–C3 | Integrity must lock repairs | Chain markers: map LB/MA/TN/SD, `P-profile-menu-hooks-safe`, `P-deploy-pin-readyz`; lib-hardening asserts | Silent wipe of fixes |

**Not done (correctly deferred):**

| Item | Why deferred |
|------|----------------|
| FlashList in SearchResultsSurface | Needs device jank proof — no invent perf |
| Redis rate-limit / market_country index | Ops + migration — not blind code |
| FI auto-create / Facebook / KYC multi-state / presence | Explicit NEVER |
| Stay/Cars redesign, SECTION_ROUTE invent | Explicit NEVER |
| Whole-file profile replace from bancoo | Would regress N0–N2 repairs |
| Merge `bancoo` or `booking-notif-test-contract-4322` | Forensic: loss / contract risk |

---

## 2) COHERENCE MODEL (MULTI-COUNTRY → MILLIONS)

```
Catalog (MARKET_COUNTRIES)
    ↓ rentalTermsForCountry / sanitizeRentalTermForMarket
Browse + Create (same taxonomy)
    ↓ marketCountryMapCenter(code)
Map WebView frame (Leaflet/OSM)
    ↓ criteria.marketCountry
SearchResultsMap — NO silent wrong country framing

Auth identity
    ↓ /me.role authoritative (Clerk metadata fallback only)
Profile chrome + FI/Banks gates
    ↓ hooks-safe menu (C1)

Deploy
    ↓ image GIT_SHA + BUILD_ID
/api/readyz → { status, checks, gitSha, buildId }
```

Scale note: coherence ≠ “add Redis today.” Coherence = **same market truth** in create/browse/map + **crash-free profile** + **provable deploy pin**. Capacity (Redis, indexes, FlashList) is the **next ops lane** after F0/F1.

---

## 3) GATE STATUS (must be green before claim “wave done”)

```bash
node scripts/chain-integrity-gate.mjs
node --test artifacts/banco-mobile/tests/lib-hardening.test.mjs \
  artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs \
  artifacts/banco-mobile/tests/mobile-resilience.test.mjs
```

Expected: chain **36/36** (34 prior + profile-hooks-safe + deploy-pin; map-center strengthened in-place).

---

## 4) OWNER BLOCKERS (must answer — do not invent)

| ID | Question | Options |
|----|----------|---------|
| **F0** | What is live primary? | A) CA-OOM `main` · B) bancoo · C) bancooom (GCP name) · D) paste live `/api/readyz` JSON |
| **F1** | After next API deploy, confirm `gitSha` matches this tip | Compare `readyz.gitSha` ↔ git tip |

Until F0 = A (or D proves CA-OOM SHA), **no cross-repo import**.

---

## 5) NEVER-TOUCH (reaffirmed)

- Stay sort **30×30** / black Stay header  
- Car `car-brand-origin-strip`  
- `SECTION_ROUTE` / Discover ENTER  
- Fake web `topPad 67`  
- Skip / anti-trap order  
- FI auto-create  
- Mega-wipes / blind merges  

---

## 6) NEXT SAFE LANES (only after green gates + F0)

1. Laptop QA paste N2 (locate deny Alert, keyboard resize, cover/chat rationale, section isolation).  
2. Capture live `readyz` after deploy (F1).  
3. Evidence-card any bancoo single-file candidates (see import board) — **file by file**.  
4. Perf: measure SearchResults jank on device before FlashList.  
5. Ops: Redis / DB index plan as separate change with migration review.
