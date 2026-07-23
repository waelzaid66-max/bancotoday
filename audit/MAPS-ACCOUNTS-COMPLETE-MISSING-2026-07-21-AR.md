# خرائط + حسابات — استكمال الغايب مع حماية UX ريبلِت
**التاريخ:** 2026-07-21 · **قاعدة:** لا تبوظ التجميع القوي / الـUX المضغوط

---

## 1) الحسابات — حالة السلسلة (لا لمس إضافي هذه الموجة)

| حلقة | الحالة | دليل |
|------|--------|------|
| Signup + OTP | ✅ PRESENT | profile.tsx |
| Skip نوع الحساب | ✅ PRESENT | onboard-skip (W1) |
| anti-trap dismiss-first | ✅ PRESENT | df68258 restore |
| هاتف MOB-01 | ✅ PRESENT | edit-phone-input |
| FI intent=fi (بروفايل + banks) | ✅ PRESENT | profile + banks.tsx |
| demote guard / agentCanAccess | ✅ PRESENT | API |
| قوائم لمس | ✅ PRESENT | W0 |

**حكم:** سلسلة الحسابات في المصدر مكتملة لما اُعتمد. أي عَرَض برودكشن بعد deploy = P1 Ops لا إعادة تصميم UX.

---

## 2) Toolkit الخرائط — قبل/بعد هذه الموجة

### PRESENT (لا تُمس — دعم ريبلِت/تجميع قوي)
Locate-me · section pin tints · bookable 📅 · server clusters · native viewport clusters · overlay · near-me 25km (native) · MOB-07 latch · Discover Explore/FAB · map toggles · car/stay compact strips

### كان MISSING مثبت (wipe) → يُستعاد الآن
| أداة | SHA أصلي | ماذا |
|------|----------|------|
| **مركز الخريطة حسب السوق** | `b68c8af` / اتمسح `93b650b` | `marketCountryMapCenter` + تمرير لـ `buildMapHtml` native+web |

### مؤجّل عمداً (مش موجود كمنتج مكتمل / مخاطرة UX)
| أداة | ليه مؤجّل |
|------|-----------|
| UI نصف قطر قابل للتعديل | لم يُشحن كاملاً — يزاحم FilterSheet المضغوط |
| sort=nearest | Wave-5 deferred — يغيّر ترتيب النتائج |
| web viewport clusters كاملة | موجة منفصلة على `.web.tsx` فقط |
| near-me على web Expo | `Platform.OS==="web"` → null بالتصميم الحالي |

---

## 3) قواعد هذه الموجة
- ملفات الخريطة فقط (+ taxonomy helper)  
- صفر تعديل على BookingStaysApp strips / Cars chrome / Discover cards  
- حارس + chain gate يقفان ضد رجوع المسح  

---

## 4) تحقق متوقع
- `node scripts/chain-integrity-gate.mjs` يشمل P-map-market-center*  
- `lib-hardening` يشمل اختبار market center  
- section guards تبقى 64/64 (لا لمس أقسام)
