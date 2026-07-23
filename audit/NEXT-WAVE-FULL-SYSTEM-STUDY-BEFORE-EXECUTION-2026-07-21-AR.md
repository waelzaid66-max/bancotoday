# دراسة الموجة القادمة — فهم عميق كامل (قبل أي تنفيذ)

**التاريخ:** 2026-07-21 · **HEAD المرجع:** `5a67b27` · **الطلب:** دراسة دقيقة حتة‑حتة بكل التبعيات قبل الموجة التالية  
**قاعدة ذهبية:** ممنوع خلط أقسام · ممنوع اختراع · ممنوع redesign · ممنوع دمج فروع ضخمة · CA-OOM = مصدر الحقيقة

---

## 0) الحكم الأعلى (جملة واحدة)

المنظومات الأساسية **مبنية ومُستعادة ومُحوّطة** على `-BANCO-CA-OOM- @5a67b27`  
(حسابات · بنوك/FI · نوتفكيشن · إيميل · رسائل · أصوات UI · خرائط · ميني‑آبس · أدمن · ماركت).  
ما يتبقى للموجة القادمة = **إثبات تشغيل (Ops)** + **فجوات ضيقة موثّقة** لكل قسم على حدة — **مش** إعادة بناء ولا خلط معلومات بين الميني‑آبس.

**chain-integrity-gate: 24/24 PASS.**

---

## 1) ماذا شُرح لريبلِت وكيرسر عن «إضافة البيانات / التلوث»؟

| المصدر | ماذا يثبت |
|--------|-----------|
| `audit/PRODUCTION-ANATOMY-AND-STRICT-PLAN-2026-07-21-AR.md` | سبب رجوع الباجز: mega-wipe ريبلِت |
| `audit/POLLUTION-CLEANOUT-RESULTS-2026-07-21-AR.md` | تنظيف جراحي بعد المسح |
| `audit/DEEP-PIECEWISE-INVENTORY-2026-07-21-AR.md` | حاضر / ممسوح / مُستعاد قطعة‑قطعة |
| `scripts/chain-integrity-gate.mjs` + `production-confidence-check.mjs` | منع شحن wipe صامت |

### الجذر الحقيقي للتلوث
- **`93b650b`** (Bancoeg / Replit — Auto-seed — ~144 ملف) أعاد UX baseline ومسح إصلاحات جراحية.
- الإصلاحات اللاحقة كانت **استعادة جزئية + حراسة** — مش redesign.

### صيانة البيانات / الرفع (PRESENT ومحمية)
| بند | دليل |
|-----|------|
| Upload storage ناقص → **503** واضح | `uploadController` + `P-upload-503-storage` |
| Upload claims **IDOR** | `uploadClaims` + `P-upload-claims-idor` |
| قوائم لمس (profile/Promote/home) | `P-menu-touch-safe-*` |
| Skip / anti-trap / هاتف / FI intent | `P-account-*` |
| فحص تلوث ريبلِت في confidence | `checkReplitWipePollution` |

**حكم:** صيانة مسار البيانات/الرفع في المصدر **مكتملة كعقد كود**. أي فشل برودكشن بعد deploy = **P1 Ops trace** (ENV/مفاتيح/تخزين) — لا لمس UI الميت `ListingMediaEditor`.

---

## 2) محادثات كلود ↔ ريبلِت ↔ كيرسر (ملفّات — مش تخمين)

### قناة handoff (`audit/handoff/`)
| ملف مركزي | الدور |
|-----------|--------|
| `REPLIT-TO-CLAUDE-FULL-SYNC-AR.md` | أسئلة ريبلِت المخزّنة لكلود |
| `CLAUDE-INVENTORY-RESPONSE-TO-REPLIT-AR.md` | رد كلود (مفاتيح، handoff، chat purge، i18n) |
| `CLAUDE-FULL-INVENTORY-STRONGEST-VERSION-FOR-REPLIT-AR.md` | تجميع أقوى نسخة لريبلِت |
| `JOINT-ARCHITECTURE-EXECUTION-PLAN-AR.md` | خطة مشتركة W0–W3 |
| `ARCHITECTURE-LAYERS-PER-MINIAPP-AR.md` | طبقات لكل ميني‑آب — ممنوع خلط |
| `AGENT-DAMAGE-AND-DISCOVER-RESTORE-AR.md` | ضرر وكلاء + استعادة Discover |
| `GOLDEN-PATH-REPLIT-CURSOR-AR.md` / `ROLES-CURSOR-VS-REPLIT-AR.md` | أدوار: ريبلِت تشغيل · كيرسر جودة/دمج |
| `CLAUDE-ACK-JOINT-ARCHITECTURE-AR.md` | إقرار كلود |

### ما اعتُمد فعلياً على main من خط كلود (أمثلة موثّقة)
- إغلاق متابعة: i18n CI · chat purge عند الحذف · `createSeat` fail-closed · scheme `bancooom` (`8eece04` وما يرتبط)
- FI Phase / bilingual notifs / email Arabic-safe / multi-market money — مذكورة في التقارير كـ PRESENT على السلسلة

### فروع ممنوعة الدمج العشوائي
- `origin/cursor/booking-notif-test-contract-4322` — تاريخ ضخم فريد (~193) — **لا تُدمَج**
- فروع `claude/*` الوثائقية — غالباً docs، ليست كنز منتج أحدث من main

### المرايا عبر الريبوهات
| ريبو | الحكم |
|------|--------|
| `-BANCO-CA-OOM-` | **مصدر التطوير** |
| `B-OOM` / `b.deals` | أسلاف — **0 كنز فريد** |
| `aws-virgen` / `bancoo(om)` | مرايا نشر متأخرة — **لا تُستعاد منها الميزات** |

---

## 3) استدعاء كل الميزات المبنية — حالة معمارية حقيقية

### 3.1 نوتفكيشن + تنبيهات + شارة
| الطبقة | الحالة | ملاحظة |
|--------|--------|--------|
| In-app NotificationService | **PRESENT** | chokepoint واحد |
| PushService + تسجيل توكن | **PRESENT** | Expo Go = لا remote push |
| Deep links `notificationRouting` | **PRESENT** | مشترك feed + push |
| Badge أيقونة + جرس الهوم | **PRESENT** | |
| «لايف» النوتفكيشن | **PARTIAL** | polling (≈12s) — مش WebSocket |

### 3.2 رسائل / محادثات
| الطبقة | الحالة |
|--------|--------|
| ConversationService + routes | **PRESENT** |
| Inbox + thread موبايل | **PRESENT** (poll 8s / 3s) |
| Unread badge تاب Messages | **PRESENT** |
| إيميل رسالة جديدة | **PRESENT** |
| Typing / Online / Presence | **MISSING** (غير مبني — لا اختراع في الموجة القادمة) |
| dealer-os رسائل | **MISSING كسطح** (السوق له مسار RFQ مختلف) |

### 3.3 أصوات + هaptic
| الطبقة | الحالة |
|--------|--------|
| SoundContext engine/key/tap + إعدادات | **PRESENT** |
| Haptics UI | **PRESENT** |
| صوت تنبيه داخل شات الرسالة | **MISSING** (جزئي — قرار منتج لاحقاً) |
| صوت قناة Push | **PRESENT** (`sound: default`) |

### 3.4 إيميلات (دورة كاملة)
| دورة | الحالة |
|------|--------|
| Welcome / Lead / Message / Match / Price drop | **PRESENT** |
| Weekly digest + Billing emails | **PRESENT** |
| Arabic-safe `\uXXXX` (BUG-001) | **PRESENT** + gate |
| لغة المستخدم من عمود DB | **PARTIAL/مؤجّل** — القوالب AR/EN موجودة؛ استدعاء غالباً افتراضي |
| Resend مفعّل على البرود | **Ops** (LogTransport إن غاب المفتاح) |

### 3.5 حالة «لايف»
| المفهوم | الحقيقة |
|---------|---------|
| صحة النظام `/status` | PRESENT |
| حالات تمويل (new/forwarded/contacted/closed) + poll بنوك | PRESENT/PARTIAL |
| دورة إعلان active/sold/archived | PRESENT |
| حضور دردشة أونلاين | **غير موجود** — لا يُبنى دون أمر صريح |

---

## 4) الميني‑آبس — كل قسم على حدة (ممنوع الخلط)

| بوابة Discover | مسار | ملكية حصرية | ممنوع يظهر |
|----------------|------|--------------|------------|
| سيارات | `/section/car` | محركات/ماركة/سنة/وقود | إيجار · خامات · منشآت |
| عقارات | `/section/real-estate` | بيع/إيجار + rental_term | وقود/ماركة · خامات |
| منشآت | `/section/factories` | مصنع/مخزن/أرض | أقساط سيارات · خامات |
| خامات | `/section/materials` | خط/خام/آلة + origin | إيجار · منشآت |
| إقامات | `/section/booking` | Stay مستقل (BookingStaysApp) | دمج Search المشترك |
| بنوك | `/business/banks` | هوية زرقاء + FI inbox | خلط كقسم بحث |

**شرائط مضغوطة (فكرة المالك — محمية):**
- Stay sort **30×30** (`4bf7cfb`) → `P-stay-compact-sort`
- Car brand+origin شريط واحد (`aa0364c`) → `P-car-compact-strip`
- Stay هيدر أسود — قفل مالك
- محاذاة الحراس `28a5111` — لا ترجع مقاسات كلود القديمة

**قانون الموجة القادمة:** أي توسعة = **PR واحد لقسم واحد** + ملاحظة أثر على النواة المشتركة إن لزم.

---

## 5) الحسابات — وكل حساب على حدة (بعد `5a67b27`)

```
Clerk → /me (DB SoT) → بوابة 4 أنواع | Skip | anti-trap
  → onboarding [?intent=fi] → verification
  → [FI] أدمن Link owner_user_id → inbox
```

| حساب | أين يُبنى | حالة |
|------|-----------|------|
| Individual | Skip / OTP personal / gate | PRESENT |
| Dealer (Business Pro) | OTP business / become-business / gate | PRESENT |
| Company | بوابة النوع (مش في أول OTP) | PRESENT |
| Financial Institution | profile + Banks `intent=fi` + onboarding + admin link | PRESENT + **inbox يعتمد ربط أدمن** |
| Supplier | `activity_type` فقط | ليس role منفصل |

### إصلاحات أخيرة للحسابات (مكتملة ومُحوّطة)
| S | ماذا |
|---|------|
| S1 | دور البروفايل/الهوم من `/me` أولاً |
| S2 | `banks-awaiting-link` بدل Join اللانهائي |
| S4 | منع demote ذاتي لـ individual (`DEMOTE_BLOCKED`) |

### بنوك في أكثر من مكان (كلها موجودة — لا تُخلط)
1. Discover → Banks hub  
2. Profile بطاقة FI / تبويب  
3. `onboarding?intent=fi`  
4. `verification` (FI copy)  
5. `banks.tsx` inbox + awaiting  
6. Admin Users (KYC docs + Link FI)  
7. Admin Financing CRM  

**فجوة تشغيل متبقية (موثّقة — قرار منتج):** لا auto-create وسيط تمويل. الموجة القادمة الآمنة = Ops ربط + مراقبة handoff — **لا** اختراع وسيط تلقائي دون أمر.

---

## 6) Expo كامل + أدمن + بانكو ماركت

| سطح | يملك | نضج |
|-----|------|-----|
| **banco-mobile** | كل الصفحات: tabs · sections · business · chat · wallet · notifs · maps · create… | قلب المنتج — محمي بـ gates |
| **api-server** | الباك الوحيد | SoT للدور/البحث/الرفع/FI/إيميل/دفع |
| **admin-os** | overview/users/listings/moderation/financing/alerts/monitoring/plans/settings… | Control Center حي |
| **dealer-os** | بانكو ماركت: dashboard/listings/leads/rfqs/wallet/investments… | بوابة تاجر |
| **landing** | توجيه نطاقات + CTAs → mobile / dealer-os / admin-os | رفيع |
| **banco-website** | ويب مستهلك (cars/RE/industrial/workspace…) | منفصل؛ soft-launch docs |
| **banco-web** | مرآة تاريخية | **مجمّد — لا توسعة** |

---

## 7) PRESENT / PARTIAL / مؤجّل (بطاقة صدق)

### PRESENT (لا تُعاد كتابته)
Upload 503+IDOR · قوائم لمس · Skip/anti-trap/هاتف · FI intent · S1/S2/S4 · شرائط Stay/Car · SECTION_ROUTE · locate-me + market center · Email cycles + Arabic-safe · Push chokepoint · Sound UI · Admin KYC+Link FI · chain 24/24

### PARTIAL (أثبت قبل توسعة)
| بند | ماذا ينقص فعلياً |
|-----|------------------|
| FI inbox تشغيلياً | ربط أدمن يدوي (متوقع حالياً) |
| Push على جهاز حقيقي | إثبات ASB/EAS (مش Expo Go) |
| Upload برودكشن | trace request-id + ENV تخزين |
| إيميل لغة المستخدم | لا عمود لغة — قرار W3 |
| رسائل «لايف» | poll فقط |
| ويب clusters/near-me | مؤجّل تصميم منفصل |

### مؤجّل عمداً (ممنوع اختراع في الموجة القادمة)
Facebook SSO · auto-create intermediary · KYC multi-state · صوت شات وارد · Presence/Typing · UI نصف قطر خريطة · دمج فروع booking-notif الضخمة · توسيع OTP لـ 4 أنواع دون موافقة

---

## 8) الموجة القادمة — ترتيب قطعة‑قطعة (بعد هذه الدراسة فقط)

> لا تُنفَّذ دفعة واحدة. كل سطر = موجة جراحية مستقلة + gate أخضر.

### الموجة N0 — Ops Truth (صفر كود منتج إن أمكن)
1. Deploy/Publish SHA = `5a67b27` (أو أحدث main)  
2. مطابقة `/status` أو لوج البناء  
3. QA يدوي جهاز: بروفايل ⋯ · Skip · هاتف · Banks awaiting · locate-me · شرائط Stay/Car · جرس نوتفكيشن · رسالة واحدة · إيميل (إن Resend حي)

### الموجة N1 — إثبات مسارات حية (قطع فقط عند فشل مثبت)
1. **Upload live trace** — request-id واحد؛ إصلاح ENV/schema عند نقطة القطع فقط  
2. **Push ASB** — فصل: in-app / lock-screen / email  
3. **FI Ops** — قائمة انتظار ربط `owner_user_id` + مراقبة handoff (بدون auto-create)

### الموجة N2 — توسعة ميني‑آب (قسم واحد لكل PR)
اختر قسماً واحداً بأمر صريح:
- Cars فقط · أو Stay فقط · أو RE فقط · أو Materials · أو Facilities  
مع الالتزام بمصفوفة العزل `SECTION-ISOLATION-STRICT` + عدم لمس شرائط المالك.

### الموجة N3 — قرارات منتج قبل كود
- عمود لغة إيميل؟  
- صوت وارد للشات؟  
- auto-link FI؟  
- Facebook SSO؟  

---

## 9) قوانين تنفيذ لأي موجة لاحقة (L1–L8 مختصرة)

1. شكوى ≠ redesign  
2. لا تمس شرائط Stay/Car المضغوطة  
3. لا تخلط فلاتر/تاكسونومي بين الأقسام  
4. لا تعطّل chain gate  
5. لا تدمج مرايا قديمة ولا فرع booking-notif الضخم  
6. حسابات: DB = الحقيقة؛ FI يحتاج ربط أدمن حتى يُقرر غير ذلك  
7. نوتفكيشن/إيميل/رفع: أصلِح نقطة القطع — لا تعِد بناء الطبقة  
8. كل توسعة = قسم واحد + تقرير أثر

---

## 10) خلاصة للمالك

| سؤال | جواب صادق |
|------|-----------|
| هل صيانة تلوث البيانات اكتملت في المصدر؟ | **نعم كعقد + حراسة** — المتبقي إثبات برودكشن |
| هل الميزات (نوتفكيشن/رسائل/إيميل/أصوات/بنوك/حسابات) مستدعاة معمارياً؟ | **نعم في المصدر** مع حدود realtime/Expo Go موثّقة |
| هل البنوك مكتملة في أكثر من مكان؟ | **نعم المسارات**؛ inbox الحي = بعد ربط أدمن |
| هل الشرائط والمقاسات محمية؟ | **نعم** (30×30 + car strip + gates) |
| ماذا بعد؟ | **N0 Ops** ثم N1 إثباتات ضيقة — ثم توسعة قسم واحد بأمرك |

**هذه الوثيقة = بوابة الموجة القادمة. لا تنفيذ منتج واسع قبل اختيار رقم الموجة (N0/N1/N2) صراحة.**
