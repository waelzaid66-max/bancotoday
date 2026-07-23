# Production Main Engine — Ledgers (bancoo MAIN)

**Updated:** 2026-07-21  
**Verified content tip (source):** `-BANCO-CA-OOM-` @ see `git rev-parse origin/main`  
**Target MAIN remote:** `waelzaid66-max/bancoo`  
**Sync status:** **BLOCKED** in cloud (no push). Laptop script ready.

| Ledger | Path |
|--------|------|
| Engine plan | `audit/production-main-bancoo/BANCOO-PRODUCTION-MAIN-ENGINE-2026-07-21-AR.md` |
| Laptop paste | `audit/handoff/PASTE-CURSOR-LAPTOP-AGENT-BANCOO-PRODUCTION-MAIN-AR.md` |
| Sync script | `scripts/publish-bancoo-production-main.sh` |
| Continuous recovery | `reports/continuous-recovery/` |
| Forensic bancoo baseline | `reports/forensic-history-2026-07-21/` |
| Fingerprint | `reports/ProductionFingerprint.json` |

## Repair Ledger (recent)

| ID | Summary | Repo effect |
|----|---------|-------------|
| C-WEB-BASE | ClerkLoadGate + web export | On CA; will flow to bancoo on sync |
| C1–C3 / N0–N2 / S1–S4 | Prior production repairs | On CA; missing from orphan bancoo tip |
| SYNC-BANCOO-MAIN | Script + docs only (this wave) | Enables owner to promote bancoo |

## Validation Matrix (cloud now)

| Gate | Status |
|------|--------|
| chain-integrity 39/39 | PASS (on CA) |
| mobile node tests | PASS (on CA) |
| pnpm install | BLOCKED |
| bancoo remote == CA tip | FAIL until sync |
| runtime production | BLOCKED |

## Pending

1. Owner/laptop: run publish script with PAT  
2. Validate on bancoo clone  
3. F1 readyz  
4. Device QA  

**Production accepted: NO**
