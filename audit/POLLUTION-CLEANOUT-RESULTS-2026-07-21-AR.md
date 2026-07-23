# Truth Pack + Pollution Cleanout Results
**التاريخ:** 2026-07-21  
**الريبو:** `-BANCO-CA-OOM-`  
**قبل:** `8e2e7f5` · **بعد التنظيف:** (هذا الكومِت)

---

## 1) فحوصات الحقائق (قبل اللمس)

| فحص | نتيجة |
|------|--------|
| `onStartShouldSetResponder` في الموبايل | وُجد في **4 أماكن**: profile menu · PromoteButton · home logo menu · home sort menu |
| مصدر الرجوع | `git blame` + `git log -S` → **`93b650b`** (Replit Auto-seed، 144 ملف) |
| الإصلاح الأصلي المعروف | `f70e016` (لمس) + `4ccf939` (maxHeight 85% + ScrollView) |
| `ListingMediaEditor` | **ميت** — لا import (مسار الرفع الحي = `create.tsx` + `lib/upload.ts`) |
| `request-url` عند نقص التخزين | كان **500 غامض** (مسح `0afef07` في `93b650b`) |
| حراس Stay/Car القديمة | **فاشلة مسبقاً** على HEAD قبل تنظيف القوائم (ليست من هذا الإصلاح) |

---

## 2) ما تم تنظيفه جراحياً (فقط المثبت)

| ملف | الاستعادة |
|-----|-----------|
| `artifacts/banco-mobile/app/(tabs)/profile.tsx` | Modal touch-safe + ScrollView + `maxHeight: "85%"` + إغلاق عند اختيار صف |
| `artifacts/banco-mobile/components/PromoteButton.tsx` | نفس نمط absoluteFill الشقيق |
| `artifacts/banco-mobile/app/(tabs)/index.tsx` | قائمتا Logo + Sort فقط (لمس) |
| `artifacts/api-server/src/controllers/uploadController.ts` | 503 واضح لنقص إعداد التخزين (`0afef07`) |

**لم يُمس:** Clerk · Facebook · Maps · Notifications logic · ListingMediaEditor · أقسام Stay/Car (تحتاج موجة منفصلة بأدلة SHA).

---

## 3) تحصين ضد رجوع التلوث

| حارس | أين |
|------|-----|
| profile / Promote / home menus | `artifacts/banco-mobile/tests/lib-hardening.test.mjs` (**15/15 PASS**) |
| anti-wipe في بوابة الثقة | `scripts/production-confidence-check.mjs` → `checkReplitWipePollution` |

بعد التنظيف: **صفر** `onStartShouldSetResponder` تحت `artifacts/banco-mobile` (ما عدا نصوص الحراس).

---

## 4) تحقق مشغّل

```
node --test artifacts/banco-mobile/tests/lib-hardening.test.mjs
→ 15/15 pass

rg onStartShouldSetResponder artifacts/banco-mobile (excl tests)
→ CLEAN
```

فشل غير متعلق بهذه الموجة (موجود قبلها / بيئة):
- `icons.test.mjs` — يحتاج `@expo/vector-icons` (deps غير مثبتة هنا)
- section guard: Stay 34×34 · Car brand strip — انحراف سابق عن الحارس؛ **مدرج كموجة تالية**

---

## 5) موجات تالية (دقة، بلا تنفيذ هنا)

1. **P-Stay/Car guard drift** — مطابقة الحارس مع الكود الحالي أو استعادة من SHA معروف بعد الـwipe  
2. **P-02 upload live trace** على البرودكشن (SHA + status codes)  
3. **P-05 notifications** — ASB vs Expo Go + `push_tokens`  
4. **P-04 Facebook** — قرار مالك ثم كود `oauth_facebook` إن لزم  
5. سياسة منع كومِتات ريبلِت واسعة النطاق

---

*تنظيف تلوث مثبت فقط. الهدف: أقرب نسخة كاملة مستقرة على نفس الريبو الحديث.*
