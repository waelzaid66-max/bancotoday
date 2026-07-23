# N1.2 Push + Deep-links — دراسة · تيست قبل/بعد · جراحة ضيقة

**HEAD قبل:** `fcceaba` · **بروتوكول:** دراسة كاملة → BEFORE gates → جراحة واحدة → AFTER gates  
**قاعدة:** لا اختراع Presence/Typing/صوت شات · لا لمس حسابات/شرائط/SECTION_ROUTE/upload

---

## 1) BEFORE (مُثبَّت)

| فحص | نتيجة |
|------|--------|
| `chain-integrity-gate` | **25/25 PASS** |
| lib-hardening | **19/19** (ثم +1 اختبار) |
| section-miniapp-guard | **48/48** |
| mobile-resilience | **7/7** |

---

## 2) خريطة التبعيات (مختصر)

```
Feature services → createNotification (mute inApp)
                 → INSERT notifications
                 → sendPushToUser (ONLY chokepoint)
                      → Expo Push API + prune DeviceNotRegistered

Mobile: usePushNotifications
  Expo Go → no remote push (intentional)
  register token when signed-in + notificationsEnabled
  tap/cold-start → routeForNotification (SHARED with feed)
```

**كل أنواع NotificationType لها مسار** في `notificationRouting.ts`.  
فشل remote على Expo Go / بدون EAS credentials = **Ops** — ليس باگ مصدر.

---

## 3) فجوة مصدر موثّقة أُغلقت (جراحة واحدة)

| | |
|--|--|
| المشكلة | سيرفر يرسل `listing_id` مع رسالة، لكن الراوتر كان يفتح الشات بـ `id` فقط |
| الأثر | ضعف chrome البائع عند فتح من push/feed مقابل inbox |
| الإصلاح | تمرير `listingId` عند وجود `listing_id` — **بدون اختراع role/name** |
| ملف | `artifacts/banco-mobile/lib/notificationRouting.ts` |

---

## 4) تقوية الأمان ضد التلوث (حراسات جديدة)

| Marker | ماذا يحمي |
|--------|-----------|
| `P-push-chokepoint` | fan-out فقط عبر `createNotification` + `data.type` |
| `P-push-expo-go-guard` | لا remote في Expo Go + shared router |
| `P-push-routing-shared` | message listingId + banks + billing |

اختبارات: lib-hardening (message+FI) · mobile-resilience (Expo Go + listingId)

---

## 5) AFTER (مطلوب أخضر)

```bash
node scripts/chain-integrity-gate.mjs          # متوقع 28/28
node --test artifacts/banco-mobile/tests/lib-hardening.test.mjs
node --test artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs
node --test artifacts/banco-mobile/tests/mobile-resilience.test.mjs
```

---

## 6) ما يبقى Ops على اللابتوب/ASB (ليس كود)

1. Build ASB/dev client — **ليس Expo Go**  
2. منح إذن الإشعارات  
3. تسجيل توكن → إرسال رسالة اختبار → دفع دافئ + cold-start  
4. تحقق المسارات: message→chat · booking role · billing · banks(financing_lead_id)  
5. فصل: in-app feed · lock-screen push · email  

---

## 7) لم يُمس

Stay 30×30 · car strip · SECTION_ROUTE · account gates · upload 503/IDOR · SoundContext UI
