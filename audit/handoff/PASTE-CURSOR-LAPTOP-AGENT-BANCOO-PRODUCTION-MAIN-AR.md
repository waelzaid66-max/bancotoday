# PASTE — وكيل اللابتوب · ترقية `bancoo` إلى Production MAIN الحقيقي

```text
GOAL = Make waelzaid66-max/bancoo the definitive Production MAIN
METHOD = Sync verified CA tip → bancoo + preserve sealed dump/memory
FORBIDDEN = Reset CA to orphan bancoo@321af02 · blind merges · invent Facebook Login
```

## 0) مطلقات
- ZERO GUESS · ZERO FEATURE LOSS · ZERO SECRET MOD · ZERO DB DAMAGE  
- لا تعلن Production Ready بدون runtime proof بعد المزامنة  

## 1) اسحب خط الإصلاح الموثّق

```bash
cd <CLONE_-BANCO-CA-OOM->
git fetch origin && git checkout main && git pull --ff-only
export SOURCE_SHA="$(git rev-parse HEAD)"
echo SOURCE_SHA=$SOURCE_SHA
node scripts/chain-integrity-gate.mjs   # متوقع 39/39
```

## 2) انشر إلى bancoo (يتطلب PAT مالك push)

```bash
export BANCOO_PRODUCTION_SYNC_TOKEN='ghp_...'   # push على bancoo
export CONFIRM_BANCOO_FORCE=YES
chmod +x scripts/publish-bancoo-production-main.sh
./scripts/publish-bancoo-production-main.sh "production-main-$(date +%Y%m%d)"
```

السكربت:
- يشغّل chain gate قبل الدفع  
- يعيد تعيين bancoo إلى `origin/main` للمصدر  
- يحافظ على `release/banco_dev_dump_2026-07-21.sql.gz` + ملاحظات `.agents/memory` الفريدة  
- force-push + tag  

## 3) تحقق على نسخة bancoo بعد المزامنة

```bash
git clone https://github.com/waelzaid66-max/bancoo.git /tmp/bancoo-main && cd /tmp/bancoo-main
git log -1 --oneline
test -f scripts/chain-integrity-gate.mjs
node scripts/chain-integrity-gate.mjs
test -f artifacts/banco-mobile/app/_layout.tsx && rg -n 'ClerkLoadGate' artifacts/banco-mobile/app/_layout.tsx
test -f release/banco_dev_dump_2026-07-21.sql.gz && echo DUMP_PRESERVED=yes
pnpm install --frozen-lockfile
node scripts/laptop-validation-matrix.mjs --with-install
# بعد نشر API:
# node scripts/laptop-validation-matrix.mjs --prod-url https://YOUR_API
```

## 4) أولويات ما بعد المزامنة (لا تغيّر ما يعمل)
1. Profile save/upload runtime  
2. Media upload runtime  
3. Auth Google/Apple/Email runtime (Facebook Login = N/A unless product decision)  
4. Maps Leaflet locate runtime  
5. Listings/search  
6. Notifs/payments — لاحقاً  

## 5) قالب رد

```text
BANCOO_MAIN_RECEIPT
SOURCE_SHA=
BANCOO_HEAD=
GATE=39/39|FAIL
DUMP_PRESERVED=yes|no
INSTALL=PASS|FAIL|BLOCKED
TYPECHECK=PASS|FAIL|BLOCKED
READYZ=
PRODUCTION_ACCEPTED=NO
NOTES=
```

## مراجع
- `audit/production-main-bancoo/BANCOO-PRODUCTION-MAIN-ENGINE-2026-07-21-AR.md`  
- `scripts/publish-bancoo-production-main.sh`  
- `audit/forensic-history/PRODUCTION-HISTORY-FORENSIC-BANCOO-BASELINE-2026-07-21-AR.md`
