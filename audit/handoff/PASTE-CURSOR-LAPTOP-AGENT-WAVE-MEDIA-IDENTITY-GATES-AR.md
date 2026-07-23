# PASTE — Laptop Agent — Wave: Media / Identity / Security gates

**Role:** Auditor only. Primary Agent owns implementation.

**Tip:** `-BANCO-CA-OOM-` `main` after this wave (expect chain **≥58**)

---

## What shipped (challenge)

### Implemented (contracts existed)
1. **Dealer edit-media hydrate + PATCH** — `listing-form-sheet.tsx`
2. **Feed safe thumbnail** — `SearchService` → `pickListingThumbnailUrl`
3. **VIDEO-POSTER (no frame extract)** — create + ListingMediaEditor set `thumbnail_url` from sibling cover image; MediaGallery uses poster when inactive
4. **Poster claim assert** — `ListingService` assert/promote `thumbnail_url`
5. **Expo identity** — name `BANCO`, package/bundle `com.bancooom.app`, scheme `bancooom` (slug `bancoboom` kept for EAS)

### Intentionally NOT invented (documented)
6. **Facebook Login** — tenant forbids; see `audit/production-gates/FACEBOOK-LOGIN-AND-FI-AUTOCREATE-SECURITY-2026-07-21-AR.md`
7. **FI auto-create** — security NEVER; awaiting-link + admin link remains the product

---

## Laptop must verify

- [ ] Chain gate all PASS  
- [ ] `listingMediaPreview` unit tests still green (if deps)  
- [ ] Universal-links + Expo identity tests PASS  
- [ ] Confirm **no** store build already uses `com.bancoboom.app` (package change risk)  
- [ ] Clerk allowlist still has `bancooom://`  
- [ ] Dealer edit: open existing listing → photos hydrate → replace → save → mobile detail updates  
- [ ] Listing with video+image: feed card shows **image**, not broken video URL  
- [ ] Confirm `oauth_facebook` absent; FI onboarding has no `createIntermediary`  
- [ ] Production accepted? **NO** without runtime install + device + deploy F1  

---

## Return format
1. Critical  
2. Medium  
3. Confirmed OK  
4. Production accepted YES/NO with evidence
