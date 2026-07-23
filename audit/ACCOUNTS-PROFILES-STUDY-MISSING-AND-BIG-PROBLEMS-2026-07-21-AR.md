# دراسة الحسابات والبروفايلات — الغايب والمشاكل الكبيرة (قبل التنفيذ)

**التاريخ:** 2026-07-21 · **HEAD:** `1dfe613` · **طلب المالك:** ادرس أولاً — لا تنفيذ كامل  
**قاعدة:** لا تخمين · أدلة من المصدر · لا لمس UX ريبلِت المضغوط

---

## 0) الحكم المختصر

| المحور | الحكم |
|--------|--------|
| سلسلة الحساب الأساسية (Signup/OTP/Skip/anti-trap/4 أنواع/intent=fi) | **PRESENT** في المصدر · محمية بـ chain gate |
| بروفايل كـ UI / قوائم / هاتف / تحقق مشتق | **PRESENT** مع فجوات منطقية |
| اكتمال منتج FI من «سجّل بنك» → inbox شغّال | **PARTIAL / مكسور تشغيلياً** بدون ربط أدمن |
| اتساق الدور بين الشاشات | **مشكلة كبيرة** (Clerk vs `/me`) |
| KYC كـ workflow | **ناقص** (boolean فقط + مراجعة أدمن جزئية) |

**لا ننفّذ شيئاً الآن** حتى موافقة صريحة على إصلاحات جراحية S1–S4 أدناه.

---

## 1) ما هو موجود فعلاً (لا يُعاد اختراعه)

| حلقة | دليل | ملاحظات |
|------|------|---------|
| Email signup + OTP | `profile.tsx` | يعمل |
| Google / Apple UI | `profile.tsx` | يعمل سطحياً (مفاتيح Clerk = Ops) |
| بوابة 4 أنواع حساب | individual / dealer / company / FI | PRESENT |
| Skip → individual | `testID="onboard-skip"` | محمي P-account-skip |
| anti-trap dismiss-first | `chooseAccountType` يغلق البوابة قبل sync | محمي P-account-anti-trap |
| FI من البروفايل + Banks CTA | `?intent=fi` | محمي P-account-fi-intent · **أصلح مسار banks القديمً** |
| Onboarding يفرض `account_type=FI` عند نشاط بنك | `onboarding.tsx` | يقلّل demote dealer |
| نجاح FI → `/business/banks` | `onboarding.tsx` done | ليس مسار بائع |
| هاتف على `/me` | MOB-01 | محمي |
| demote guard جزئي عند `business` بدون نوع | `UserService` elevated | يحمي FI/company من إجبار dealer عند business فقط |
| verification تفضّل `/me.role` | `verification.tsx` | صحيح |
| أدمن: مستندات KYC + Verify + ربط FI owner | `admin-os/.../users.tsx` | موجود (تقرير FI القديم جزئياً قديم) |
| حذف حساب | `UserService.deleteAccount` | PRESENT |
| روابط اجتماعية / غلاف / bio | Clerk unsafeMetadata + API | PRESENT |
| chain integrity حسابات | 21/21 يشمل P-account-* | لا تعطيل |

---

## 2) الغايب (Missing) — بدقّة

### M1 — ربط المؤسسة المالية تلقائياً (الأهم تشغيلياً)
- Onboarding FI يحدّث فقط: `users.role` + `companyDetails`.
- **لا ينشئ** صف `financing_intermediaries` ولا يملأ `owner_user_id`.
- الـ inbox يشتغل فقط لعضو مؤسسة (`FinancingService` → "Not a financial-institution member").
- الربط اليوم: **أدمن يدوياً** من Users → Link FI.
- **النتيجة للمستخدم:** دور FI + شاشة banks بدون inbox — يبدو «مكسور» رغم أن الدور صح.

### M2 — مسار Email signup لا يعرض Company / FI
- OTP يعرض فقط `personal | business` → يُحفظ كـ `individual | dealer`.
- Company / FI متاحان فقط بعد SSO أو قائمة «نوع الحساب» لاحقاً.
- **ليس باگ كود** بالضرورة — قرار منتج ناقص في القمع الأول.

### M3 — Supplier ليس نوع حساب
- موجود كـ `activity_type` فقط داخل onboarding.
- لا يوجد `role=supplier` ولا صلاحيات منفصلة.
- أي توقع «حساب مورّد» = غير موجود كمنتج.

### M4 — حالات KYC متعددة
- الحقل الوحيد: `is_verified` boolean.
- الواجهة تشتق «قيد المراجعة» = `isBusiness && !isVerified`.
- لا يوجد: pending / needs_info / rejected / تاريخ رفض / سبب.
- أدمن: toggle Verify + عرض docs — **ليس** workflow موافقة متعدد الخطوات.

### M5 — فورم بنكي مستقل
- نفس فورم الأعمال (اسم / مدينة / مستندات).
- لا حقول ترخيص بنكي / سجل / نوع رخصة منفصلة.
- الفصل حالياً = `intent=fi` + activity + نصوص نجاح مختلفة فقط.

### M6 — ما لا يُخترع الآن (قرار منتج صريح مطلوب)
- Facebook SSO · عمود لغة للمستخدم لإيميلات · دليل بنوك حي · multi-state KYC كامل · auto-create وسيط تمويل لكل FI.

---

## 3) المشاكل الكبيرة (Big problems) — مرتّبة

### B1 — البروفايل يقرأ الدور من Clerk `publicMetadata` وليس من `/me`
**دليل:**
- `profile.tsx` ≈822 / ≈1212: `user.publicMetadata?.role`
- `verification.tsx` ≈139–142: `/me.role` أولاً ثم Clerk fallback
- السيرفر: DB = مصدر الحقيقة؛ sync لـ Clerk **best-effort** وغير حاجز (`meController` + `UserService`)

**الأثر:**
- بعد `updateMe` قد يتأخر/يفشل مرآة Clerk → بطاقات FI / Business / تبويب Banks / شارة الدور **خاطئة أو متأخرة** على البروفايل بينما verification صحيحة.
- نفس المستخدم يرى حقيقتين مختلفتين بين شاشتين.

**إصلاح جراحي مقترح (S1):** نفس عقد verification: `meRole || clerkRole` في profile فقط — بدون إعادة تصميم UI.

### B2 — قائمة «نوع الحساب» تسمح بالتخفيض بلا حماية عميل
**دليل:**
- قائمة ⋯ → `setNeedsAccountType(true)` → `chooseAccountType("individual")` يستدعي `updateMe({ account_type: "individual" })`.
- `UserService` عند وجود `account_type` **يعيد كتابة الدور مباشرة** (فرد/تاجر/شركة/FI) — حماية `elevated` تنطبق على مسار `business` فقط، **لا** تمنع demote صريح عبر `account_type`.

**الأثر:** FI/company موثّق يقدر ينزل لنفسه فرداً من القائمة → يفقد بطاقات/تبويبات؛ الربط البنكي قد يبقى معلّقاً.

**إصلاح (S4):** تحذير + تأكيد، أو منع التخفيض من العميل + رفض/تسجيل على السيرفر لـ demote ذاتي بدون أدمن.

### B3 — FI بدون وسيط = منتج ناقص (انظر M1)
أكبر فجوة «الحسابات تبدو شغّالة لكن التمويل لا».

**إصلاح (S2) بعد موافقة:** إما (أ) CTA واضح «بانتظار ربط الأدمن» على banks عند 401/403، أو (ب) إنشاء/طلب ربط وسيط عند اكتمال onboarding FI — قرار منتج.

### B4 — `become-business` يذهب onboarding بدون `account_type`
**دليل:** `testID="become-business"` → `/business/onboarding` بلا query.
- لفرد عادي + نشاط غير بنك → السيرفر يضع `dealer` (مقصود تقريباً).
- لا يمرّ عبر اختيار company/FI.
- النصوص تقول «حساب شركة» بينما المسار عملياً أقرب لـ Business Pro/dealer.

**إصلاح (S5 توثيق/نسخ):** توضيح المنتج أو تمرير نوع صريح — بدون توسيع فورم.

### B5 — ازدواجية هوية العرض
- الاسم/الصورة/الغلاف/bio: Clerk.
- الهاتف/`is_verified`/رقم الحساب/`role` الحقيقي: DB عبر `/me`.
- `companyDetails` للأدمن؛ الموبايل لا يعيد عرض كل حقول KYC (مقصود جزئياً في verification).

ليس باگ وحده، لكن يغذّي B1 عند فشل sync.

### B6 — مخاطر تشغيل / تراجع (ليست باگ منطق)
- مفاتيح Clerk في النشر.
- تعطيل chain gate أو mega-wipe مثل `93b650b` يعيد كسر Skip/anti-trap.

---

## 4) خريطة التبعيات (Dependencies) — لا تُلمس عرضاً

```
Clerk Auth (session)
  → AuthTokenBridge
  → GET/PATCH /v1/me  (UserService: role, phone, companyDetails, is_verified)
  → best-effort Clerk publicMetadata.role

Profile UI
  ← Clerk user (حالياً للدور — مشكلة B1)
  ← useGetMe (هاتف، رقم حساب، verified)
  ← metrics / social / own listings

Account type gate
  → updateMe(account_type)
  → onboarding [?intent=fi]
       → updateMe(business [+ account_type FI])
       → [ناقص] financing_intermediaries.owner_user_id
            → banks inbox

Admin OS Users
  → Verify toggle + docs + Link FI owner
```

**لا تُكسر أثناء أي إصلاح:**
anti-trap order · onboard-skip · intent=fi · edit-phone · Join hide عند عضوية · Stay/Cars compact · SECTION_ROUTE · locate-me · chain gate.

---

## 5) ما كان قديماً في تقارير سابقة وصار مصلحاً (لا تُعاد كـ missing)

| بند قديم | الوضع على `1dfe613` |
|----------|---------------------|
| Banks CTA بدون intent=fi → dealer | **مُصلح** (`intent=fi`) |
| Onboarding بنك بدون account_type | **مُصلح** (يفرض FI عند نشاط بنك) |
| أدمن لا يعرض مستندات | **مُصلح جزئياً** (يعرض docs + verify + link) |
| Skip / anti-trap ممسوح | **مُستعاد + محمي بالـ gate** |

---

## 6) خطة جراحية مقترحة — بعد موافقة فقط

| ID | ماذا | مخاطرة | يمس ملفات |
|----|------|--------|-----------|
| **S1** | دور البروفايل من `meQuery` أولاً | منخفضة | `profile.tsx` فقط |
| **S2** | CTA «بانتظار ربط المؤسسة» على banks عند ليس عضواً | منخفضة–متوسطة | `banks.tsx` (+ i18n) |
| **S3** | توضيح قمع Email (نص: Company/FI من الإعدادات) أو توسيع الاختيار — قرارك | متوسطة إن توسيع UI | profile signup |
| **S4** | منع/تحذير demote من قائمة نوع الحساب | منخفضة | profile + اختياري UserService |
| **S5** | توثيق become-business = مسار dealer | صفر كود | docs |
| **S6** | Ops: مفاتيح Clerk + deploy SHA الحالي | Ops | لا كود |
| **S7** | الإبقاء على chain gate | — | لا تعطيل |

**لا تُنفَّذ الآن:** auto-create وسيط تمويل · فورم بنكي جديد · KYC multi-state · Facebook · إعادة تصميم البروفايل.

---

## 7) تحقق عند أي تنفيذ لاحق

```bash
node scripts/chain-integrity-gate.mjs          # يجب 21/21
# ثم اختبارات mobile ذات الصلة إن وُجدت
```

QA يدوي بعد S1: بعد اختيار FI → reload برودكشن → بطاقة Banks تظهر فوراً حتى لو تأخر Clerk.

---

## 8) خلاصة للمالك

**الحسابات في المصدر ليست «فاضية»** — السلسلة الأساسية موجودة ومحمية.  
**المشاكل الكبيرة الحقيقية:** (1) البروفايل يثق بـ Clerk بدل DB، (2) FI بدون ربط وسيط = inbox ميت، (3) إمكانية تخفيض الدور من القائمة، (4) قمع الإيميل ضيّق + KYC boolean.  

**الخطوة التالية:** موافقتك على S1 (وربما S2/S4) فقط — تنفيذ جراحي، بدون موجة كاملة.
