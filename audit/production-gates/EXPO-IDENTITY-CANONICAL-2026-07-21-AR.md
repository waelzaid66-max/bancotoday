# Expo identity — canonical alignment

**Date:** 2026-07-21  
**Wave:** align display name + iOS/Android package to ecosystem SoT

## Matrix (after this wave)

| Field | Value | Notes |
|-------|--------|------|
| Display name | `BANCO` | Was `BANCO B--OOM` (WIP artifact label) |
| Slug | `bancoboom` | Kept for EAS project continuity (`projectId` unchanged) |
| Scheme | `bancooom` | Canonical (deep links / OAuth) — already correct |
| iOS bundle | `com.bancooom.app` | Was `com.bancoboom.app` (config drift) |
| Android package | `com.bancooom.app` | Same |
| EAS projectId | `45f092c8-52f9-4272-880f-48e6b721126f` | Unchanged |

## Sources of truth
- `.agents/memory/banco-scheme-canonical.md`
- `release/DEPLOYMENT.md` (com.bancooom.app)
- Universal links test asserts scheme + package

## Risk / Laptop verify
If any **store build** was already shipped under `com.bancoboom.app`, changing package creates a **new app listing** (cannot update old). Laptop must confirm:
- No production Play/App Store listing under `com.bancoboom.app`, OR
- Owner accepts new package as first production identity.

Clerk redirect allowlist must include `bancooom://` (scheme unchanged — low risk).

## Not changed (owner-gated)
- Expo slug rename (`bancoboom` → `banco-mobile`) — EAS URL/branding only; not required for deep links.
- inventing new schemes.
