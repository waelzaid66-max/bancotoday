# Security / product gates — Facebook Login & FI auto-create

**Date:** 2026-07-21  
**Status:** INTENTIONALLY NOT IMPLEMENTED (security + tenant truth)  
**Primary agent verdict:** Completing these as “features” would be **product invention** and violate Clerk tenant + FI AuthZ design.

---

## Facebook Login

### Evidence
- Clerk strategies in app: `oauth_google` | `oauth_apple` only (`profile.tsx` SSO path).
- Tenant memory: `.agents/memory/banco-auth-tenant-limits.md` — Facebook / LinkedIn / phone login **must NOT be faked**.
- Social profile platforms API enum: instagram | linkedin | website | whatsapp — **no facebook**.
- `socialIcon("facebook")` is display-only for unknown external links — not an auth button.

### Why not “complete” Facebook Login in-repo
1. Clerk tenant does not advertise `oauth_facebook` as enabled.
2. Implementing a button without tenant enablement = **fake auth UX** (security + review failure).
3. Enabling Facebook requires: Clerk Dashboard + Meta app + redirect allowlist + privacy policy + App Store review — **owner/ops**, not surgical code.

### Safe completion done this wave
- Documented gate (this file).
- Chain / fingerprint continue to mark Facebook Login as **N/A — not a product provider**.

### Owner path to enable later
1. Enable Facebook in Clerk + Meta developer app.
2. Add `oauth_facebook` strategy beside Google/Apple with same redirect contract.
3. Update tenant memory + allowlist tests.
4. Never invent a stub.

---

## FI auto-create

### Evidence
- Onboarding sets `account_type: financial_institution` only — **no** `createIntermediary`.
- Intermediary create is **admin-only** (`FinancingService.createIntermediary`).
- Mobile `banks-awaiting-link` when FI role && no membership — intentional wait state.
- Admin queue visibility exists for linking owners.

### Why not auto-create
Auto-creating a financing intermediary on signup would mint a privileged org without admin review → **permission escalation / trust abuse**. Explicit NEVER in production audits.

### Safe completion (already product-complete)
| Step | Owner |
|------|--------|
| User chooses FI | Mobile onboarding |
| Role = financial_institution | `/me` |
| Awaiting link UI | `banks.tsx` |
| Admin creates + links intermediary | Admin-os |
| Membership clears awaiting | Existing membership query |

### Owner ops checklist (not code invent)
1. Admin creates FI org.
2. Links `owner_user_id` to the FI user.
3. User reopens Banks → membership resolves.

---

## Laptop Agent challenge questions
1. Confirm Clerk Dashboard: is `oauth_facebook` enabled? (expect NO)
2. Confirm no code path calls `oauth_facebook`.
3. Confirm no signup path inserts into financing intermediaries table.
4. If owner wants Facebook: return enablement plan, do not ask Primary Agent to stub.
