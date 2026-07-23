# PASTE — وكيل اللابتوب · إكمال الإنتاج F0/F1 + Validation Matrix
## انسخ هذا الملف كاملاً إلى Cursor على اللابتوب · نفّذ بالترتيب · لا تتخطّى مرحلة فاشلة

```text
REPO = waelzaid66-max/-BANCO-CA-OOM-
EXPECTED_TIP_AT_WRITE ≥ 7a9ba50 (pull أولاً — خذ origin/main الفعلي)
F0 POLICY (موصى بالدليل) = A engineering SoT + C bancooom mirror AFTER sync
F0 FORBIDDEN = B bancoo as primary
```

---

## 0) قوانين مطلقة (لا استثناء)

- ZERO GUESS · ZERO BLIND MERGE · ZERO VISUAL REGRESSION  
- **ممنوع:** Stay 30×30 / car-brand-origin-strip / SECTION_ROUTE invent / FI auto-create / Facebook Login invent / دمج bancoo كامل / فرع `booking-notif-test-contract`  
- كل حالة = **PASS | FAIL | BLOCKED** فقط (لا UNKNOWN)  
- إذا فشل تحقق: **STOP** → جذور → إصلاح جراحي → أعد التحقق  
- لا تعلن Production Ready بدون موافقة المالك بعد المصفوفة الخضراء + F1

---

## 1) مزامنة المصدر

```bash
cd <CLONE_OF_-BANCO-CA-OOM->
git fetch origin
git checkout main
git pull --ff-only
export SYNC_SHA="$(git rev-parse HEAD)"
echo "SYNC_SHA=$SYNC_SHA"
node scripts/chain-integrity-gate.mjs
# متوقع: 36/36 PASS
```

---

## 2) تثبيت + مصفوفة التحقق الكاملة (اللابتوب عنده شبكة)

```bash
pnpm install --frozen-lockfile
node scripts/laptop-validation-matrix.mjs --with-install
# بعد معرفة URL الحي للـ API:
node scripts/laptop-validation-matrix.mjs --prod-url "https://YOUR_LIVE_API_HOST"
```

يكتب: `reports/laptop-validation-results.json`

يجب أن تمر (عند توفر deps):

| id | معنى |
|----|------|
| source.chain_integrity | 36 markers |
| mobile.node_static_suites | 75 tests |
| validate.typecheck | monorepo |
| validate.eslint_scripts | eslint scripts |
| validate.mobile_full_test | pnpm mobile test |
| validate.api_unit | api-server vitest |
| validate.admin_typecheck / dealer / web / landing | أسطح |
| build.api / admin / dealer | بناء |
| production.readyz | بعد --prod-url |

---

## 3) F0 تنفيذ — مزامنة `bancooom` (مرآة نشر فقط)

**لا تجعل bancooom مصدر هندسة.** املأه من CA-OOM:

```bash
# يتطلب PAT مالك بصلاحية push على bancooom:
export BANCOOOM_SYNC_TOKEN='ghp_...'   # من المالك فقط
./scripts/publish-bancooom-deploy.sh
git ls-remote https://github.com/waelzaid66-max/bancooom.git HEAD
# يجب أن يساوي $SYNC_SHA
```

تحقق GCP: المشغّل يشير إلى **bancooom** + `deploy/gcp/cloudbuild.deploy.yaml` (راجع `deploy/gcp/BANCOOOM_CANONICAL_DEPLOY.md`).

---

## 4) F1 — إثبات SHA الحي

بعد نشر API من الصورة المبنية بـ `GIT_SHA` bake:

```bash
curl -sS "$PROD_API/api/healthz"   # يجب {status:"ok"} بدون اشتراط gitSha
curl -sS "$PROD_API/api/readyz" | tee /tmp/readyz.json
# يجب: status + checks.database + gitSha ≈ $SYNC_SHA + buildId
node scripts/laptop-validation-matrix.mjs --prod-url "$PROD_API"
```

الصق JSON في ردك للمالك/الكلاود.

---

## 5) QA جهاز (N2) — Android ASB + iOS

1. Map Locate: grant OK · deny → Alert (`locate_error`)  
2. Android keyboard فوق الشات (`softwareKeyboardLayoutMode: resize`)  
3. Cover + Chat attach: rationale قبل OS prompt  
4. كل ميني‑آب: عزل SECTION + شرائط المالك  
5. Push على ASB **ليس** Expo Go  
6. بروفايل: قائمة ⋯ تفتح بدون كراش (C1 hooks-safe)  
7. سوق LB/MA/TN/SD: الخريطة لا تبدأ على مصر بالخطأ

---

## 6) توثيق بعد النجاح الجزئي/الكامل

```bash
node scripts/generate-production-validation-standard.mjs
node scripts/generate-production-protocol-reports.mjs
git add reports/laptop-validation-results.json reports/ProductionFingerprint.json reports/production-validation-standard-* audit/handoff || true
# إن وُجدت نتائج حقيقية فقط — commit برسالة docs(validation): laptop matrix …
git status
```

**لا تدفع نتائج مزيفة.** إذا BLOCKED بسبب سر/شبكة — اكتب السبب.

---

## 7) قالب رد إلزامي (انسخ واملأ)

```text
LAPTOP_RECEIPT
SYNC_SHA=
GATE=36/36|FAIL
INSTALL=PASS|FAIL
TYPECHECK=PASS|FAIL|BLOCKED
LINT=PASS|FAIL|BLOCKED
MOBILE_TEST=PASS|FAIL|BLOCKED
API_TEST=PASS|FAIL|BLOCKED
ADMIN_TC=PASS|FAIL|BLOCKED
DEALER_TC=PASS|FAIL|BLOCKED
WEB_TC=PASS|FAIL|BLOCKED
BUILD_API=PASS|FAIL|BLOCKED
BANCOOOM_HEAD=
BANCOOOM_MATCHES_SYNC=YES|NO|SKIP
READYZ_JSON=
READYZ_SHA_MATCH=YES|NO|BLOCKED
ANDROID_N2=pass|fail|skip
IOS_N2=pass|fail|skip
LOCATE=pass|fail|skip
PROFILE_MENU=pass|fail|skip
MAP_LB_MA_TN_SD=pass|fail|skip
NEVER_TOUCH_OK=YES
PRODUCTION_ACCEPTED=NO
NOTES=
```

---

## 8) ما يبقى على وكيل الكلاود (هذه البيئة)

- لا `node_modules` (npm registry ECONNRESET)  
- لا push إلى bancooom (token بدون صلاحية)  
- مجسات readyz من هنا BLOCKED  

لذلك **اللابتوب هو مسار الإكمال الإلزامي** للخطوات 2–5.

---

## مراجع

- `audit/F0-F1-EVIDENCE-RECOMMENDATION-2026-07-21-AR.md`  
- `reports/ProductionFingerprint.json`  
- `reports/production-validation-standard-2026-07-21/`  
- `audit/BANCOO-IMPORT-BOARD-ZERO-BLIND-2026-07-21-AR.md`  
- `scripts/laptop-validation-matrix.mjs`
