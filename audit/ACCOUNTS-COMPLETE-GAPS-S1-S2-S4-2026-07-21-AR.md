# إكمال الحسابات — فهم عميق + سد فجوات حقيقية (بدون اختراع)

**التاريخ:** 2026-07-21 · **بعد:** `057cf32` study · **هذا التنفيذ يكمل S1/S2/S4**  
**قاعدة:** لا اختراع منتج · لا كسر منطق كبير · حماية من التلوث عبر chain gate

---

## 1) الدورات الكاملة (ما فُهم من المصدر)

```
Clerk (OTP | Google | Apple)
  → getOrCreateUser (/me)
  → بوابة نوع الحساب (4 أنواع | Skip | anti-trap)
  → updateMe(account_type) → users.role (DB SoT)
  → onboarding [?intent=fi] → companyDetails (+ FI account_type)
  → verification (مشتق من is_verified)
  → [FI فقط] أدمن يربط financing_intermediaries.owner_user_id
  → banks inbox (عضوية owner|seat)
```

**ما كان PRESENT مسبقاً:** Skip · anti-trap · intent=fi · هاتف · demote elevated على مسار business · أدمن KYC docs + link · delete account · chain P-account-*

---

## 2) ما أُكمل الآن (فجوات حقيقية فقط)

| ID | الفجوة | الإصلاح | ملفات |
|----|--------|---------|--------|
| **S1** | بروفايل + هوم يقرآن Clerk فيتأخر الدور | `meRole \|\| clerkRole` | `profile.tsx`, `index.tsx` |
| **S2** | FI بلا رابط وسيط يرى Join ويعيد onboarding | `banks-awaiting-link` بعد استقرار /me+inbox | `banks.tsx`, i18n |
| **S4** | تخفيض صامت لـ individual من القائمة/Skip | رفض عميل + `DEMOTE_BLOCKED` سيرفر + 403 | `profile.tsx`, `UserService`, `meController` |
| **Anti-pollution** | رجوع wipe يمسح الإصلاح | markers جديدة في chain gate + guards | `chain-integrity-gate.mjs`, tests |

**عمداً لم يُخترع:** إنشاء وسيط تلقائي · KYC multi-state · فورم بنكي جديد · Facebook · role=supplier · توسيع قمع Email لـ 4 أنواع.

---

## 3) سلوك واقعي بعد الإكمال

1. ترقية FI → بطاقة/تبويب Banks على البروفايل تتبع `/me` فوراً (بعد invalidate).  
2. FI يفتح Banks بدون `owner_user_id` → «ربط المؤسسة قيد الانتظار» + رابط verification — **مش** Join من جديد.  
3. فرد/تاجر يفتح Join كالسابق مع `intent=fi`.  
4. شركة/FI يحاول Individual من القائمة أو Skip → تنبيه؛ السيرفر يرفض لو تجاوز العميل.  
5. dealer ↔ individual وترقيات تبقى مسموحة.

---

## 4) تحقق

```bash
node scripts/chain-integrity-gate.mjs
pnpm --filter @workspace/banco-mobile run test:lib
pnpm --filter @workspace/banco-mobile run test:section-guard
```
