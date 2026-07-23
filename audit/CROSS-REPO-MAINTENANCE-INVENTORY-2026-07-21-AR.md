# جرد صيانات عبر الريبوهات — بحث فقط (بدون تركيب)

**التاريخ:** 2026-07-21  
**HEAD المدروس (هدف الشغل النظيف):** `-BANCO-CA-OOM-` @ `ef8174d`  
**القاعدة:** ممنوع تركيب / دمج / دفع صيانة قبل فهم البنية + مسار آمن.

---

## 0) الخطة (Phases) — ما نفعله وما لا نفعله

| مرحلة | العمل | حالة |
|-------|--------|------|
| **P0** | جرد كل الريبوهات + الفروع + التاجات + مقارنة الـSHAs | ✅ تم |
| **P1** | تصنيف المشاكل: بيئة (ENV) vs كود (CODE) vs نشر (DEPLOY) | ✅ تم |
| **P2** | حصر صيانات المحاور الأربعة بالتواريخ والمصدر | ✅ تم |
| **P3** | تحديد ما الناقص / ما المنتكس / ما المركّب أصلاً في HEAD | ✅ تم |
| **P4** | خطة استعادة آمنة (cherry-pick / surgical fix) — **بدون تنفيذ** | ✅ مخطط |
| **P5** | تنفيذ بعد موافقة المالك، محور محور، مع تحقق | ⏸ معلّق |

**ممنوع الآن:** merge عشوائي للفروع · push لمرايا · تفعيل Facebook وهمي · تغيير أسرار إنتاج بدون checklist.

---

## 1) خريطة الريبوهات — الحقيقة الرقمية

| الريبو | دور | `main` SHA | علاقته بـ `-BANCO-CA-OOM-` |
|--------|-----|------------|---------------------------|
| **`-BANCO-CA-OOM-`** | مصدر التطوير الأحدث / هدف الشغل | `ef8174d` | المرجع |
| **`B-OOM`** | مرآة أقدم + تاجات استقرار | `6fce7a3` | **محتواة بالكامل** داخل CA-OOM (0 commits فريدة) |
| **`b.deals`** | مرآة/نسخة قديمة | `8f7a63a` | **محتواة بالكامل** (0 commits فريدة؛ CA متقدم بـ ~288) |
| **`aws-virgen`** | مرآة نشر AWS فقط | `d386f52` (≈ v1.1.3-seller-social @ 2026-07-10) | متأخرة جداً؛ commits مزامنة/manifest فقط فوق خط قديم |
| **`bancoo`** (رابط سابق) | مرآة أخرى | `321af02` | متأخرة عن الأساسي |
| **`bancooom`** | مرآة GCP المفضّلة بالاسم | كان يطابق `ef8174d` سابقاً | للنشر وليس مصدر صيانة |

### استنتاج حاسم
**لا يوجد «كنز كود ناقص» في `B-OOM` أو `b.deals` فوق ما في `-BANCO-CA-OOM-`.**  
كلاهما أسلاف (ancestors) للـmain الحالي. الشغل الإضافي موجود أصلاً في CA-OOM — أو ضاع داخل نفس الخط بسبب regressions / نشر قديم.

### تاجات استقرار مهمة (تواريخ)
| Tag | تقريباً | أين |
|-----|---------|-----|
| `v1.1.4-production-2026-07-10` | 10 يوليو | b.deals + CA-OOM + B-OOM |
| `v1.1.5` / `v1.1.6` | 11 يوليو | CA-OOM / B-OOM |
| `v1.2.0` → `v1.4.0-stable` | 17–18 يوليو | B-OOM (ومحتواة في CA) |
| aws-virgen `v1.1.0`…`v1.1.3` | 10 يوليو | AWS فقط — قديمة |

### فروع صيانة على CA-OOM
| فرع | علاقة بـ main |
|-----|----------------|
| `maintenance/wave-1-3-upload-search-eas` | ancestor — مدمج |
| `maintenance/wave-4-search-taxonomy` | ancestor — مدمج |
| `fix/mobile-master-stabilize` | ancestor — مدمج |
| `cursor/booking-notif-test-contract-4322` | **1 commit فريد** — فرع خطر موثّق سابقاً؛ لا تدمج بلا مراجعة |
| معظم `cursor/*` و `claude/*` | docs أو مدمج عبر PRs |

---

## 2) تقسيم جذري: بيئة vs إصلاحات كود vs نشر

| الطبقة | أمثلة | علاجها |
|--------|--------|--------|
| **ENV / لوحة خارجية** | Clerk OAuth providers، OTP email، Object Storage bucket، RESEND، PAYMOB، OPENAI | إعداد لوحة / أسرار — ليس cherry-pick |
| **CODE** | قائمة بروفايل touch-dead، Facebook strategy غائب، map HTML، upload IDOR | إصلاح جراحي على CA-OOM |
| **DEPLOY** | كود صحيح على `main` لكن الإنتاج يعرض بناء قديم (`static-build` / Publish يدوي) | إعادة نشر من SHA معروف + `/status` |
| **SCHEMA** | جدول `upload_claims` غير موجود على DB الحي | `push-force` / migrate عند الإقلاع |

توثيق سابق صريح (فرع `claude/urgent-merge-deploy`):  
**«الإصلاحات مش ظاهرة = DEPLOY مطلوب مش merge»** — كثير من أعطال البرودكشن الحالية من هذه الطبقة.

---

## 3) المحور A — صيانة قائمة البروفايل الشخصي

### ما المركّب في HEAD `ef8174d`
- قائمة overflow `⋯` + عناصر (تعديل، غلاف، إعلانات، محفظة، خطط، إعدادات، خروج…)
- تنبيه إكمال الملف (صورة/سيرة/هاتف)
- روابط اجتماعية (instagram/linkedin/website/whatsapp) عبر API
- MOB-01 حقل هاتف في مودال التعديل
- نقل زر القائمة بجانب Edit Profile (`47cc4e5` @ 2026-07-19)
- `menuItems` useMemo (`79dc2de`)

### صيانات تاريخية مهمة
| تاريخ | SHA | ماذا |
|-------|-----|------|
| 2026-07-10 | `f70e016` | إصلاح touch: backdrop شقيق (مش لفّ الـsheet) |
| 2026-07-12 | `4ccf939` | cap ارتفاع + ScrollView للقائمة |
| 2026-07-12 | `93b650b` | **wipe سيئ** — مسح hardening كثير |
| 2026-07-16 | `26c80e9` | استعادة أجزاء مما مسحه 93b650b |
| 2026-07-10 | `1aecea5` | استعادة social links |
| 2026-07-19 | `f69d51e` / `#35` | MOB-01 phone |
| 2026-07-19 | `47cc4e5` | profile menu position fix |

### الحالة الآن (فجوة مؤكدة في الكود)
في `profile.tsx` حالياً:
```
<Pressable style={menuBackdrop}>
  <View style={menuSheet} onStartShouldSetResponder={() => true}>
```
هذا **نفس النمط الموثّق** في `audit/mobile/PROFILE-BUTTON-INVENTORY-AR.md` كسبب «كل الأزرار ميتة».  
إصلاح `f70e016` (backdrop منفصل + sheet شقيق) **منتكس جزئياً** في HEAD.

| تصنيف | الحكم |
|--------|--------|
| نوع المشكلة | **CODE regression** |
| مصدر الإصلاح الأصلي | داخل نفس ريبو CA-OOM (تاريخ `f70e016` / `4ccf939`) — **ليس** من b.deals/B-OOM ككود فريد |
| مسار آمن لاحقاً | إعادة تطبيق نمط touch-safe + ScrollView/maxHeight جراحياً + اختبار يدوي Android/iOS |

---

## 4) المحور B — رفع الصور والفيديوهات

### ما المركّب في HEAD
Pipeline كامل:
1. `uploadMediaAsset` (موبايل) → resize ≤2048 + Content-Type  
2. `POST /uploads/request-url` → claim  
3. PUT للتخزين  
4. `/verify` → `/promote` (مع حماية ملكية / IDOR C-01)  
5. `ListingMediaEditor` في create + edit (wave 10C)

| تاريخ | SHA | ماذا |
|-------|-----|------|
| 2026-07-05 | `09e103a` | S3 provider switch |
| 2026-07-07 | `e24014b` | P0 upload IDOR + `upload_claims` |
| 2026-07-07 | `3607c0a` | استقرار رحلة الرفع |
| 2026-07-10 | `9818ac0` | wave 10C edit media |
| 2026-07-12 | `0afef07` | 503 واضح لو التخزين غير مضبوط |
| 2026-07-20 | `6fa6567` | حذف blobs عبر واجهة ObjectStorage |

### فجوات البرودكشن الأرجح
| عرض المشكلة | الطبقة | الدليل |
|-------------|--------|--------|
| 401/500 عند الرفع | **ENV** bucket ميت/أجنبي | `.agents/memory/replit-object-storage-repoint.md` |
| 403 على promote/attach | **SCHEMA** جدول `upload_claims` | `audit/fixes/C-01-upload-idor.md` |
| فشل على جهاز حقيقي | **ENV/permissions** + شبكة | STATUS / UPLOAD_AUDIT |
| كود الرفع نفسه | غالباً **سليم في HEAD** | موجود ومُراجَع أمنياً |

**لا يُستورد من مرايا قديمة** — الموجود في b.deals/aws أقدم من خط CA الحالي.

---

## 5) المحور C — الخرائط / أماكن / دبابيس / سيرش خريطة

### ما المركّب في HEAD
- Leaflet 1.9.4 + markercluster داخل WebView (`mapHtml.ts` / `SearchResultsMap`)
- `GET /v1/search/map` clustering سيرفر
- دبابيس bookable (زمردي / 📅)
- Discover Map FAB + Explore on map (`79dc2de`, `fd42052`)
- `LocationPicker` = taxonomy + suggestions (مش خريطة Google)
- `expo-location` لـ near-me / إنشاء إعلان — ليس مصدر pins
- Section melt أُصلح عبر W1 + guards؛ `SECTION_ROUTE` موجود في HEAD

| تاريخ | SHA | ماذا |
|-------|-----|------|
| مبكراً | `dbcf24f` | server-side map clusters |
| 2026-07-05 | `9d596c1` | bookable badge على pins |
| 2026-07-10+ | waves 4/5 | geo / near-me / rental filters |
| 2026-07-16 | `dfd9019` | ألوان pins حسب القسم |
| 2026-07-19 | `6b3c1d1` / `a4b5ec0` | MOB-07 map latch |
| 2026-07-19–20 | `79dc2de` / `fd42052` | FAB + Explore card |

### فجوات / مخاطر
| عرض | طبقة |
|-----|------|
| خريطة فاضية / CDN | ENV شبكة أو حظر unpkg داخل WebView |
| melt قديم يظهر في البرودكشن | **DEPLOY** بناء قديم بدون W1 |
| «مكتبات Google Maps ناقصة» | سوء فهم — التصميم **Leaflet/OSM** عمداً |
| GPS radius على الخريطة | ميزة مؤجّلة موثّقة — ليست مكتبة ناقصة من ريبو آخر |

---

## 6) المحور D — Clerk: إيميل / جوجل / فيسبوك / أبل (حرج)

### ما في الكود (`profile.tsx`)
| الطريقة | في الكود؟ | ملاحظة |
|---------|-----------|--------|
| Email + password | ✅ | |
| Email OTP (تحقق/إعادة تعيين) | ✅ | الإرسال من **Clerk** وليس Resend |
| Google `oauth_google` | ✅ | |
| Apple `oauth_apple` | ✅ زر (غير Android) | قد يكون **مسار ميت** إن لم يُفعَّل في Tenant |
| **Facebook login** | ❌ **غير موجود** | فقط أيقونة social-link للبائع — ليست SSO |

السطر الحالي:
`strategy: provider === "google" ? "oauth_google" : "oauth_apple"`  
→ لا يوجد `oauth_facebook` في الموبايل ولا في الـAPI.

### حقيقة الـTenant (من `.agents/memory/banco-auth-tenant-limits.md`)
تحقق حي سابق لـ FAPI `/environment`:
- مدعوم: email/password، email OTP، **Google فقط** من الـsocial
- Apple: كان غير مفعّل → 422
- قاعدة المشروع: **ممنوع تزييف** Facebook/LinkedIn/phone login

### تعارض توقّع المالك
> «فيسبوك غايب وأنا مفعّله»

احتمالات متزامنة:
1. مفعّل في **Clerk Dashboard** لكن **الكود لا يستدعي** `oauth_facebook` → الزر لن يظهر ولن يعمل.
2. مفعّل على **تطبيق/مشروع Clerk غلط** (مفتاح publishable مختلف عن اللي في الموبايل).
3. خلط بين «رابط فيسبوك على بروفايل البائع» و«تسجيل دخول فيسبوك».

| طبقة | الحكم |
|------|--------|
| Google لا يعمل | غالباً **ENV/Dashboard** + مفاتيح التطبيق |
| Apple يظهر ولا يعمل | **ENV** أو إخفاء الزر حتى التفعيل |
| Facebook غائب | **CODE ناقص عمداً/بالقاعدة** + يحتاج قرار مالك: إضافة استراتيجية رسمية أم لا |
| OTP لا يصل | **Clerk email** (مش Resend) |

---

## 7) ماذا «ناقص من المرايا»؟ إجابة مباشرة

| هل نحتاج نسخ من `b.deals` / `B-OOM` / `aws-virgen`؟ | الجواب |
|-----------------------------------------------------|--------|
| كود أحدث منهم غير موجود في CA-OOM؟ | **لا** — هم أقدم |
| صيانات البروفايل/الرفع/الخرائط؟ | موجودة في تاريخ CA-OOM؛ بعضها **منتكس** أو **محتاج ENV/DEPLOY** |
| aws-virgen؟ | للنشر AWS فقط؛ متأخر عن خط الإنتاج الحالي بشهور من commits |
| أين نشتغل؟ | **`-BANCO-CA-OOM-` فقط** كمصدر حقيقة |

---

## 8) خطة التنفيذ الآمنة لاحقاً (بعد الموافقة — لم تُنفَّذ)

### ترتيب مقترح
1. **DEPLOY truth:** تأكيد أن البرودكشن يخدم SHA = `ef8174d` (أو أحدث متفق) عبر `/status` + build logs.  
2. **ENV checklist موازي (بدون كود):**  
   - Clerk: Email OTP · Google · Apple · (قرار Facebook)  
   - مطابقة `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`  
   - Object Storage bucket حي + وجود `upload_claims`  
3. **CODE surgical — Profile menu:** إعادة touch-safe + scroll/cap؛ اختبارات testIDs.  
4. **CODE — Clerk Facebook (اختياري بقرار):** إضافة `oauth_facebook` + زر + لا تزييف إن فشل الـtenant.  
5. **Maps QA على جهاز:** WebView + CDN + FAB + clusters مع فلاتر.  
6. **Uploads QA على جهاز:** request → PUT → verify → promote → attach.  
7. **بعد الاستقرار فقط:** sync مرايا (`bancooom` / `aws-virgen`) بأدوات النشر الرسمية — ليس كمصدر إصلاح.

### قواعد الأمان
- لا merge لـ `booking-notif-test-contract` بدون مراجعة العقد.
- لا «استيراد ريبو كامل» من b.deals/B-OOM.
- كل إصلاح = commit صغير + typecheck + حراس الموبايل ذات الصلة.
- فصل PR للبيئة عن PR للكود في التوثيق حتى لو التنفيذ متزامن.

---

## 9) ملخص تنفيذي للمالك

1. الريبو النضيف الأحدث للشغل هو **`-BANCO-CA-OOM-` @ `ef8174d`**.  
2. `B-OOM` و`b.deals` **لا يحملان صيانات أحدث غائبة** — هما خلفه.  
3. أعطال البرودكشن خليط من:  
   - **قائمة بروفايل:** regression كود touch  
   - **رفع وسائط:** غالباً ENV/DB  
   - **خرائط:** كود موجود؛ أعطال CDN/Deploy/GPS  
   - **Clerk:** Google/Apple = لوحة؛ **Facebook login غير مكتوب في التطبيق** رغم تفعيل محتمل في Clerk  
4. الخطوة التالية بعد موافقتك: نبدأ بإثبات SHA المنشور، ثم إصلاح البروفايل جراحياً، ثم checklist Clerk/Storage — **بدون دمج مرايا عشوائي**.

---

*ملف بحث فقط. لا تغييرات سلوكية طُبّقت في هذه الجولة.*
