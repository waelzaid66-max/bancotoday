# Historical Timeline

| Field | Value |
|-------|-------|
| Standard | Production Execution & Validation Standard |
| Repository | `waelzaid66-max/-BANCO-CA-OOM-` |
| Branch | `main` |
| Commit | `7c74602fbbc0e7ecaa65f945ebbefb1e29de73aa` (`7c74602`) |
| Describe | `v1.4.0-stable-2026-07-18-206-g7c74602` |
| Latest tag | `v1.4.0-stable-2026-07-18` |
| Author | Cursor agent (validation standard) |
| Date | 2026-07-21 |
| Production accepted | **NO** |



| When | Event | Evidence |
|------|-------|----------|
| ≤ Jul 11 | production tags v1.1.x | tags on CA-OOM |
| Jul 13 | Mega-wipe `93b650b` | ancestor of HEAD; ~144 files |
| Jul 17–18 | stable tags v1.2–v1.4 | `v1.4.0-stable-2026-07-18` |
| Jul 9 | bancooom created/pushed | still **empty** as of this study |
| Jul 10 | aws-virgen sync | tip `d386f52` stale |
| Jul 21 AM–PM | Accounts + N0–N2 + forensic + scale C1–C3 + protocol reports | tip `7c74602` |
| Jul 21 14:34Z | bancoo orphan handoff `321af02` | missing integrity gate |
| Post-wipe → HEAD | 238 commits | continuous repair line |

**Root cause of “fixed then gone”:** wipe `93b650b` + incomplete restores — mitigated by chain-integrity-gate (36 markers).

