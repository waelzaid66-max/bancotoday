# N0 خط الأساس + N1.1 نظافة مسار الرفع (تيست قبل/بعد)

**التاريخ:** 2026-07-21 · **بروتوكول:** دراسة → تيست قبل → إصلاح جراحي → تيست بعد → حراسة

---

## N0 — خط الأساس (قبل أي إصلاح جديد)

| فحص | SHA | نتيجة |
|------|-----|--------|
| `chain-integrity-gate.mjs` | `d396d71` | **24/24 PASS** |
| `lib-hardening.test.mjs` | نفسه | **19/19 PASS** |
| `section-miniapp-guard.test.mjs` | نفسه | **48/48 PASS** |

**حكم N0 كود:** أخضر. المتبقي على اللابتوب = QA يدوي + deploy SHA.

---

## N1.1 — دراسة مسار البيانات/الرفع (حتة‑حتة)

### PRESENT (لا إعادة بناء)
- Create: pick → upload → verifyWithRetry → attach  
- `uploadController` 503 عند غياب التخزين  
- `assertCallerMayUseUpload` IDOR  
- Client `verifyUploadWithRetry` على 503  
- Create handler يحوّل `MEDIA_VERIFY_RETRYABLE` → 503  

### فجوة مصدر موثّقة (أُغلقت)
| | |
|--|--|
| المشكلة | `updateListingHandler` كان يحوّل فشل تحقق تخزين عابر إلى **500** بينما create → **503** |
| التبعية | `ListingService.updateListing` يستدعي نفس `assertImages/VideosWithinSizeLimit` التي ترمي `MEDIA_VERIFY_RETRYABLE` |
| الإصلاح | نفس عقد create: 503 + INVALID_DATA 400 + FORBIDDEN 403 |
| ملف | `artifacts/api-server/src/controllers/listingController.ts` |
| حراسة | `P-upload-update-503` في chain gate |

### ليس N1.1 (مؤجّل)
- إحياء `ListingMediaEditor`  
- UI تعديل وسائط على الموبايل  
- Stay/Cars/SECTION_ROUTE/حسابات  

### Ops إن فشل الرفع وgate أخضر
ENV تخزين · جدول `upload_claims` · مفاتيح Clerk · smoke بـ token

---

## بروتوكول تيست (إلزامي)

### قبل
```bash
node scripts/chain-integrity-gate.mjs
node --test artifacts/banco-mobile/tests/lib-hardening.test.mjs
node --test artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs
```

### بعد (هذا الـ PR)
نفس الأوامر + التأكد من `P-upload-update-503` PASS  
عدم لمس أي ملف ميني‑آب/شرائط/حسابات في نفس الـ commit

---

## تسليم اللابتوب
`audit/handoff/PASTE-CURSOR-LAPTOP-AGENT-N0-N1-AR.md`
