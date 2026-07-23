# N2 — منصة مشتركة (Android + iOS) · دراسة عميقة قبل التوسعة

**HEAD قبل:** `e2cb0f5` · **الحكم:** الميني‑آبس PRESENT ومقفولة — N2 = hygiene منصة وليس اختراع فلاتر قسم

---

## BEFORE
| فحص | نتيجة |
|------|--------|
| chain-integrity-gate | **30/30** |
| mobile suites | **75/75** |

---

## دراسة الميني‑آبس (واقعية)

| سطح | حالة | ملاحظة |
|-----|------|--------|
| Cars / Stay / RE / Facilities / Materials | **PRESENT** | شرائط المالك محمية |
| Discover SECTION_ROUTE | **PRESENT** | لا melt |
| Banks | **PRESENT** (N1.3) | خارج SECTION_ROUTE |
| توسعة منتج لقسم واحد بلا باگ جهاز | **غير آمن** | = اختراع |

**لذلك N2 = نواة مشتركة تؤثر على كل الأقسام على أندرويد وiOS.**

---

## جراحات N2 المنفَّذة (موثّقة فقط)

| # | ماذا | لماذا Android/iOS | ملفات |
|---|------|-------------------|--------|
| 1 | Locate-me يبلّغ deny/timeout بدل صمت | WebView GPS على الجهازين | `mapHtml.ts` · `SearchResultsMap.tsx` |
| 2 | `softwareKeyboardLayoutMode: resize` | لوحة مفاتيح Android تغطي المدخلات | `app.json` |
| 3 | Cover rationale قبل OS gallery | Play/iOS disclosure | `profile.tsx` |
| 4 | Chat attach rationale | نفس الإفصاح | `messages/[id].tsx` |
| 5 | تعليق حارس Stay 30×30 (كان يقول 34) | منع «إصلاح» خاطئ | `section-miniapp-guard` |
| 6 | حراسات جديدة | ضد التلوث | `P-map-locate-error` · `P-android-keyboard-resize` · `P-cover-photo-rationale` · `P-chat-attach-rationale` |

**عمداً لم يُنفَّذ (يحتاج قياس جهاز أولاً):**
- FlashList بدل FlatList في `SearchResultsSurface`
- قنوات Push متعددة الأنواع
- clusters على web map
- UI نصف قطر الخريطة

**NEVER-touch بقي:** Stay 30×30 · car strip · SECTION_ROUTE · fake topPad 67 · حسابات S1–S4 · upload · FI auto-create

---

## AFTER (متوقع)

```bash
node scripts/chain-integrity-gate.mjs   # 34/34
node --test artifacts/banco-mobile/tests/lib-hardening.test.mjs \
  artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs \
  artifacts/banco-mobile/tests/mobile-resilience.test.mjs
```

---

## قائمة QA للابتوب — Android ASB + iOS (مهم جداً)

### مشترك لكل ميني‑آب
- [ ] Discover → قسمه الخاص (لا melt)
- [ ] شرائط القسم صحيحة (Cars مدمج · Stay 30×30 أسود · لا خلط تاكسونومي)
- [ ] خريطة → Locate me: سماح يعمل · رفض يظهر تنبيه (N2)
- [ ] MiniAppBottomNav لا يبلع اللمس (Android بلا BlurView)

### Android
- [ ] لوحة المفاتيح لا تغطي شات/إنشاء (resize)
- [ ] Push heads-up (ليس Expo Go)
- [ ] أيقونات SVG بلا tofu
- [ ] Cover/Chat: شاشة إفصاح قبل إذن المعرض

### iOS
- [ ] Safe area أعلى الهيدر
- [ ] Locate me + إذن الموقع
- [ ] Push permission + cold-start deep-link
- [ ] Cover/Chat rationale ثم OS prompt
- [ ] لوحة مفاتيح مع حقل البحث مفتوح (راقب تغطية)

### قياس أداء (بلّغ فقط — لا كود بعد)
- [ ] تمرير نتائج القسم طويل: هل فيه جَنْك مقابل هوم FlashList؟

---

## التالي بعد إثبات الجهاز
- إن جَنْك مثبت → PR واحد: FlashList في `SearchResultsSurface` فقط  
- إن طلب المالك قسماً باسمه → N2b توسعة ذلك القسم فقط
