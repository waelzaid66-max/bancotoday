# Repair Report — STATUS CACHE / SOLD / ACCOUNT SoT

| Field | Value |
|-------|-------|
| Commit | `e4c8118337c79ce5591f99c638cd8608a8717bc8` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


## Unique ID
`REP-STATUS-CACHE-SOLD-2026-07-21`

## Problem
1. Mine/detail/chat status mutations updated local UI only — profile grid/feed stayed stale.
2. Mine + dealer-os could not mark sold (chat/detail only).
3. `accountTypeChosen` was set before `updateMe` — failed sync + cold restart skipped retry forever.

## Evidence
- Precision audit after `5d027bf`
- Existing `updateListing({ status })` + `bumpListings` / RQ keys

## Root Cause
Archive wave closed UI gaps but not cross-surface cache; Clerk flag written optimistically for anti-trap without SoT revert.

## Files Modified
See fingerprint.lastRepair.files

## Validation
- chain-integrity-gate: PASS
- mobile node tests: PASS
- typecheck/lint/full build: BLOCKED (no node_modules)

## Rollback
`git revert` this commit; gates will fail intentionally if markers regress.

## Final Status
CODE MERGED on working line · NOT production-accepted · bancooom still FAIL · live F1 BLOCKED

