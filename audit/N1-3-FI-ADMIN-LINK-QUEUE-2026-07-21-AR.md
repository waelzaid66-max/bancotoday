# N1.3 FI Admin Link Queue — دراسة · تيست قبل/بعد · جراحة رؤية فقط

**HEAD قبل:** `87274ea` · **بروتوكول:** دراسة → BEFORE → جراحة بدون auto-create → AFTER

---

## BEFORE
| فحص | نتيجة |
|------|--------|
| chain-integrity-gate | **28/28 PASS** |
| mobile suites (lib+section+resilience) | **75/75 PASS** |

---

## دراسة (حكم)

مسار الربط **مكتمل بالتصميم**: onboarding يضبط الدور فقط · الأدمن يربط `owner_user_id` · الموبايل يعرض `banks-awaiting-link`.  
**لا auto-create وسيط.**

الفجوة الحقيقية = **وضوح طابور الأدمن** (API يدعم `role=` لكن UI لم يكن يصفّي · لا شارة «صندوق غير مربوط»).

---

## جراحة N1.3 (رؤية + سلامة فقط)

| تغيير | ملف |
|-------|------|
| فلتر دور الحساب + زر «FI awaiting link» | `admin-os/.../users.tsx` |
| شارة `fiInboxUnlinked` لـ FI بلا `owner_user_id` | نفس الملف |
| منع اختيار وسيط يملكه FI آخر | `ownedByOther` disabled |
| Review KYC يظهر لـ FI حتى بدون docs إن `canLinkFi` | نفس |
| اختبار FORBIDDEN للـ inbox بلا ربط | `FinancingService.test.ts` |
| حراسات `P-fi-admin-queue` + `P-fi-inbox-forbidden-unlinked` | chain gate |

**لم يُخترع:** إنشاء وسيط تلقائي · KYC multi-state · تعديل Stay/Cars/SECTION_ROUTE/upload/حسابات الموبايل.

---

## AFTER (متوقع)

```bash
node scripts/chain-integrity-gate.mjs   # 30/30
node --test artifacts/banco-mobile/tests/lib-hardening.test.mjs \
  artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs \
  artifacts/banco-mobile/tests/mobile-resilience.test.mjs
```

FinancingService vitest يحتاج DB/ENV — مضاف في المصدر ومحمي بالـ gate.

---

## Ops على الأدمن بعد النشر

1. Users → زر **FI awaiting link**  
2. راجع شارة **Inbox unlinked**  
3. KYC Review → Link intermediary (صف بلا مالك آخر)  
4. الموبايل: awaiting يختفي بعد نجاح العضوية
