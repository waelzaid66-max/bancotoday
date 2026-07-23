# BANCO `/reports`

## Current mandatory packs

| Pack | Path |
|------|------|
| **Production Fingerprint (canonical JSON)** | [`ProductionFingerprint.json`](./ProductionFingerprint.json) |
| **Validation Standard (F0/F1 + full mandatory set)** | [`production-validation-standard-2026-07-21/`](./production-validation-standard-2026-07-21/) |
| Protocol v1.0 evidence pack | [`production-protocol-v1-2026-07-21/`](./production-protocol-v1-2026-07-21/) |
| **Laptop validation results** | [`laptop-validation-results.json`](./laptop-validation-results.json) |
| **Forensic history (bancoo baseline study)** | [`forensic-history-2026-07-21/`](./forensic-history-2026-07-21/) |
| **Continuous recovery (current)** | [`continuous-recovery/`](./continuous-recovery/) |
| **Production MAIN engine (bancoo)** | [`production-main-engine/`](./production-main-engine/) |

### Regenerate

```bash
node scripts/generate-production-validation-standard.mjs
node scripts/generate-production-protocol-reports.mjs
node scripts/laptop-validation-matrix.mjs --with-install
# after live API known:
node scripts/laptop-validation-matrix.mjs --prod-url https://YOUR_API_HOST
```

### F0 / F1 owner brief (Arabic)

`audit/F0-F1-EVIDENCE-RECOMMENDATION-2026-07-21-AR.md`  
Laptop paste: `audit/handoff/PASTE-CURSOR-LAPTOP-AGENT-F0-F1-COMPLETE-AR.md`  
Dual-agent split: `audit/CONTINUATION-CLOUD-LAPTOP-DUAL-AGENT-2026-07-21-AR.md`

**Production Ready is NOT declared** while install/typecheck/live F1 remain BLOCKED.

## Other folders

| Folder | Meaning |
|--------|---------|
| `from-maintenance/` | Historical maintenance audits |
| `from-other-repos/` | Knowledge snapshots — **not** merge sources |
