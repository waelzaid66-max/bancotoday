# F0 / F1 — توصية مبنية على دراسة أدلة حقيقية
## بدون تخمين · مع الحفاظ على كل الإصلاحات

**التاريخ:** 2026-07-21  
**نقطة الدراسة:** `-BANCO-CA-OOM-` @ `7c74602`  
**المصادر:** GitHub API + shallow clone + وثائق `deploy/gcp/BANCOOOM_CANONICAL_DEPLOY.md` + `DUAL_REPO_STATUS.md` + سلسلة `chain-integrity-gate` + مجسات `/api/readyz`

---

## الخلاصة للمالك (قرار واحد واضح)

### F0 — ما هو «الأساسي»؟

| الدور | الأفضل بالدليل | لماذا |
|------|----------------|-------|
| **مصدر الهندسة والمنتج (Source of Truth)** | **A) `-BANCO-CA-OOM-`** | الخط المستمر الوحيد؛ فيه بوابة النزاهة 36/36؛ كل إصلاحات Jul-21 (حسابات/رفع/دفع/FI/خرائط/hooks)؛ 238 كومِت بعد المسح `93b650b` |
| **مرآة نشر GCP فقط** | **C) `bancooom` بعد مزامنة من A** | الاسم صالح لـ OCI (لا شرطة في أول المسار) — يمنع exit 125. **لكن الريبو الآن فارغ (size=0)** فلا يُستخدم كمصدر منتج |
| **ممنوع كأساسي** | **B) `bancoo`** | dump يتيم `321af02`؛ **لا يوجد** `chain-integrity-gate.mjs`؛ دمجه يمحو الإصلاحات |

**سياسة الحفاظ على كل شيء:**  
اطوّر على **A** دائماً → زامن إلى **C** للنشر → لا تلمس Stay/Cars/`SECTION_ROUTE`/FI auto-create → لا تستورد `bancoo` بالجملة.

### F1 — ما هو SHA الحي؟

| الحالة | الدليل |
|--------|--------|
| الكود جاهز لعرض `gitSha`/`buildId` على `/api/readyz` | موجود منذ `5c6e813` |
| مجس حي من بيئة الوكيل | **BLOCKED** (TLS reset / DNS على replit و banco.store) |
| محتوى `bancooom` = A | **لا** — فارغ منذ آخر push 2026-07-09 |

**الإجراء:**  
1) `./scripts/publish-bancooom-deploy.sh`  
2) نشر Cloud Build من `bancooom`  
3) الصق JSON من `GET $PROD/api/readyz`  
المتوقع: `gitSha` = SHA الذي زامنته من CA-OOM.

---

## أدلة حية جُمعت هذه الجلسة

| ريبو | tip | ملاحظة قاطعة |
|------|-----|----------------|
| CA-OOM | `7c74602` | نشط اليوم |
| bancooom | *(لا commits)* | empty repository |
| bancoo | `321af02` | بدون chain gate |
| aws-virgen | `d386f52` | قديم (10 Jul) |

---

## هل نعلن Production Ready؟

**لا.**  
التحقق الكامل (install/typecheck/lint/builds/live F1) لم يمر كله.  
التقارير: `reports/production-validation-standard-2026-07-21/` + `reports/ProductionFingerprint.json`.

---

## ما الذي تأكده أنت؟

رد مختصر يكفي:

1. **F0:** أوافق على A للهندسة + C كمرآة نشر بعد مزامنة؟ (نعم/لا)  
2. **F1:** الصق ناتج `/api/readyz` بعد أول نشر من المرآة المزامَنة.
