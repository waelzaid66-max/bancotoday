# حزمة تسليم — وكيل Cursor على اللابتوب (N0 → N1.3)

**اسحب `main` أولاً** · المتوقع بعد N1.3: commit يتضمن طابور FI أدمن

```bash
git fetch origin && git checkout main && git pull --ff-only
node scripts/chain-integrity-gate.mjs   # يجب 30/30
node --test artifacts/banco-mobile/tests/lib-hardening.test.mjs \
  artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs \
  artifacts/banco-mobile/tests/mobile-resilience.test.mjs
```

## اقرأ
1. `audit/NEXT-WAVE-FULL-SYSTEM-STUDY-BEFORE-EXECUTION-2026-07-21-AR.md`
2. `audit/N0-BASELINE-AND-N1-UPLOAD-HYGIENE-2026-07-21-AR.md`
3. `audit/N1-2-PUSH-DEEPLINK-STUDY-AND-HARDENING-2026-07-21-AR.md`
4. `audit/N1-3-FI-ADMIN-LINK-QUEUE-2026-07-21-AR.md`
5. هذا الملف

## QA على اللابتوب
- [ ] N0: Profile/Skip/هاتف/شرائط/Discover/رفع
- [ ] N1.2: ASB push (ليس Expo Go)
- [ ] **N1.3 Admin:** Users → زر FI awaiting link → شارة Inbox unlinked → Link owner → الموبايل awaiting يختفي

## ممنوع
Stay/Cars redesign · SECTION_ROUTE melt · auto-create وسيط · دمج booking-notif الضخم

**ردك:** `SYNC_SHA` · `GATE=30/30` · `FI_QUEUE=pass|fail`
