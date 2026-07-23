# BANCOO / CROSS-REPO IMPORT BOARD
## ZERO BLIND MERGE · EVIDENCE CARDS ONLY · CA-OOM REMAINS WORKING LINE

**Date:** 2026-07-21  
**Working tip policy:** `-BANCO-CA-OOM-` `main` = active engineering line until owner F0 says otherwise.  
**bancoo tip studied:** `321af02` (orphan handoff dump — **no merge-base** with CA-OOM HEAD).

---

## RULE

| Action | Allowed? |
|--------|----------|
| Whole-tree reset/merge CA-OOM → bancoo | **FORBIDDEN** (deletes chain-integrity-gate + regresses repairs) |
| Bulk “best of” copy | **FORBIDDEN** |
| Single-file import after Evidence Card + gate | Allowed **only** with owner F0 + card PASS |
| Knowledge read of bancoo / B-OOM / aws-virgen | Allowed |

---

## BOARD

| Candidate | Source | Verdict | Why | Next |
|-----------|--------|---------|-----|------|
| Profile `menuItems` plain array (hooks-safe) | bancoo pattern | **ADOPTED surgically** on CA-OOM (C1) | Evidenced Rules-of-Hooks bug on HEAD | Done — do not whole-file replace profile |
| `release/banco_dev_dump_2026-07-21.sql.gz` | bancoo unique | **QUARANTINE** | Likely secrets/PII; not product code | Security owner review only |
| `.agents/memory/*` unique notes | bancoo | **KNOWLEDGE** | Mostly duplicated / low product value | Optional read; no auto-copy |
| Wipe-era UX that HEAD already restored | bancoo shrinks profile/upload | **REJECT** | Diff shows regression vs N0–N2 | Keep HEAD |
| `origin/cursor/booking-notif-test-contract-4322` | CA-OOM branch | **DO NOT MERGE** | Contract/test risk; large unique history | Contract review if ever needed |
| B-OOM / b.deals tips | older | **0 unique treasure** vs HEAD | Contained ancestors | Ignore for import |
| aws-virgen `d386f52` | AWS mirror | **STALE** | Sync/manifest only | Ops knowledge |

---

## HOW TO CARD A FUTURE FILE (template)

```
Evidence Card ID:
File path:
Source SHA:
Diff vs HEAD (stat + intent):
Does it touch NEVER-TOUCH (Stay/Cars/SECTION_ROUTE/FI auto-create)? 
Gate impact (which markers)?
Rollback plan:
Owner F0 approval: Y/N
```

No card → no import.

---

## F0 REMINDER

Until owner confirms live primary:

- **A)** CA-OOM · **B)** bancoo · **C)** bancooom · **D)** live `/api/readyz`  

…this board stays **closed for import**.
