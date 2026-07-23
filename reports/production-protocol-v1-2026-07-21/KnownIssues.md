# Known Issues

| Field | Value |
|-------|-------|
| Protocol | BANCO STORE Production Execution Protocol v1.0 |
| Repository | `waelzaid66-max/-BANCO-CA-OOM-` |
| Branch | `main` |
| Commit | `5c6e8139ee3a49e54f27823ef6c9e456ced417e6` (`5c6e813`) |
| Author | Cursor agent (production protocol v1.0) |
| Date | 2026-07-21 |
| Stance | ZERO GUESS · ZERO BLIND MERGE · EVIDENCE ONLY |

> **Production verdict:** **NOT DECLARED READY.** Protocol acceptance criteria are not fully satisfied while install/typecheck/lint/live F0–F1 remain blocked or pending.


| ID | Issue | Evidence | Status |
|----|-------|----------|--------|
| KI-ENV-01 | npm registry ECONNRESET — cannot pnpm install in agent VM | curl/corepack logs | OPEN (infra) |
| KI-F0 | Owner has not confirmed live primary repo | Forensic conflict bancoo label vs CA-OOM evidence | OPEN (owner) |
| KI-F1 | Live `/api/readyz.gitSha` not captured | No production URL response in session | OPEN (owner/ops) |
| KI-RATE-01 | express-rate-limit default memory store multi-instance | rateLimiter.ts | OPEN (scale ops) |
| KI-QA-N2 | Device Android/iOS manual proof pending | N2 handoff paste | OPEN (laptop QA) |

