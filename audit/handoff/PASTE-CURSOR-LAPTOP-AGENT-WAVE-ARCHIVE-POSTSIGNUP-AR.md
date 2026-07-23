# PASTE — Cursor Laptop Agent — Wave: Archive / Post-signup / Edit invalidate

**Role:** Architecture reviewer · deep auditor · regression verifier · production validator  
**Not:** Implementation owner (Primary Production Agent owns shipping)

**Repo tip to audit:** `-BANCO-CA-OOM-` `main` after this wave (expect chain **46/46**)

---

## What shipped (challenge these)

1. **EDIT-LISTING-INVALIDATE** — `artifacts/banco-mobile/app/listings/edit/[id].tsx`  
   After PATCH success: `bumpListings()` **and** `queryClient.invalidateQueries({ queryKey: getGetListingQueryKey(id) })`.

2. **POST-SIGNUP-NO-NAV-ON-FAIL** — `artifacts/banco-mobile/app/(tabs)/profile.tsx`  
   Post-signup `updateMe` uses `synced` flag; on failure Alert + **return** — no `router.push("/business/onboarding")`.

3. **MOBILE-ARCHIVE** — mine + listing detail  
   - `mine.tsx`: archive (active→archived) / reactivate (archived→active) via `updateListing(id, { status })`  
   - `listing/[id].tsx`: owner `handleArchive` / `handleReactivate`  
   - i18n EN+AR under `mine.*`  
   - Feather `archive` mapped in `components/icons.tsx`

4. Chain markers added: `P-edit-listing-invalidate`, `P-post-signup-no-nav-on-fail`, `P-mobile-archive-wired`, `P-listing-detail-archive`

---

## Laptop checklist (must evidence)

- [ ] Gate: `node scripts/chain-integrity-gate.mjs` → 46/46  
- [ ] Tests: mobile hardening suite → 89/89 (or current count)  
- [ ] With deps: `pnpm install --frozen-lockfile` + typecheck/lint where possible  
- [ ] Search regressions: sold flow still works; archived listings hidden from public feed (server already)  
- [ ] Confirm dealer-os archive still uses bulk action; mobile uses PATCH status — same DB statuses  
- [ ] Post-signup: force `updateMe` failure path in mind — user must **not** enter onboarding  
- [ ] Edit media + text save: reopen listing detail — media/title not stale  
- [ ] Icons: `archive` / `rotate-ccw` render (not CircleAlert fallback)  
- [ ] Do **not** invent VIDEO-POSTER or rename app.json without owner  

---

## Explicit non-goals this wave

- Facebook Login / magic link invent  
- FI auto-create  
- Google Maps live engine  
- Video thumbnail frame extract  
- bancoo orphan tip as SoT / blind reset  

---

## Return format

1. Critical findings (must fix before next wave)  
2. Medium / maintainability  
3. Confirmed OK with evidence paths  
4. Production accepted? **YES only with runtime proof** — else **NO**
