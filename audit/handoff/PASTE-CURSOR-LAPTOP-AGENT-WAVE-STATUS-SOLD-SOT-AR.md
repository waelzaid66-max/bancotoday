# PASTE — Cursor Laptop Agent — Wave: Status cache / Sold / Account SoT

**Role:** Architecture reviewer · deep auditor · regression verifier · production validator  
**Not:** Implementation owner

**Repo:** `-BANCO-CA-OOM-` `main` after this wave (expect chain **≥51/51**)

---

## Shipped — challenge these

1. **ACCOUNT-TYPE-CHOSEN-AFTER-ME** — `profile.tsx`  
   - `chooseAccountType`: still dismiss-first (`setNeedsAccountType(false)` before `updateMe`)  
   - Clerk `accountTypeChosen: true` **only after** successful `updateMe`  
   - On fail: revert flag false + reopen gate  
   - Post-signup: do not set `accountTypeChosen` in consent write; set after `/me`; on fail `setNeedsAccountType(true)` + no onboarding nav

2. **STATUS-MUTATION-CACHE** — mine / listing detail / messages  
   - `bumpListings()` + invalidate `getGetMyListingsQueryKey` (+ listing key where known) after sold/archive/reactivate/delete/renew/promote

3. **MINE-MARK-SOLD** — `confirmSold` → `updateListing(..., { status: "sold" })`

4. **DEALER-OS-MARK-SOLD** — row action via `useUpdateListing` `{ status: "sold" }` + i18n EN/AR

5. **PROMOTE refresh** — mine + detail pass `onPromoted` → notify/reload

---

## Laptop checklist

- [ ] `node scripts/chain-integrity-gate.mjs` → all PASS  
- [ ] Mobile node tests → all PASS (incl. account-type SoT assertion)  
- [ ] With deps: typecheck/lint when possible  
- [ ] Cold-restart mental model: failed `/me` must re-show account-type gate  
- [ ] Anti-trap: slow `/me` must not pin user on gate (dismiss-first retained)  
- [ ] Mark sold from mine → profile grid `is_active` updates without kill-app  
- [ ] Dealer-os sold → list refreshes; archive/activate unchanged  
- [ ] Do **not** invent VIDEO-POSTER / Facebook / FI auto-create / Expo rename  

---

## Deferred (not this wave)

- Dealer-os edit-media hydrate (`UpdateListingBody.media` already on mobile)  
- Ops: bancoo MAIN sync, bancooom, live F1, npm install  

---

## Return format

1. Critical findings  
2. Medium  
3. Confirmed OK + paths  
4. Production accepted? **YES only with runtime proof** — else **NO**
