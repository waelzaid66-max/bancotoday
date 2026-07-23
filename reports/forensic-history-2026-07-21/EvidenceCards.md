# Evidence Cards — bancoo baseline forensic (NO IMPORT)

Status legend: **QUARANTINE** · **KNOWLEDGE** · **VERIFY** · **DEFER** · **REJECT**

| ID | Artifact | Status | Locate | Understand | Compare | Deps | Compat | Risk | Next |
|----|----------|--------|--------|------------|---------|------|--------|------|------|
| C-DUMP-01 | `bancoo:release/banco_dev_dump_2026-07-21.sql.gz` | QUARANTINE | ✓ | Sealed DB dump ~844KB uncompressed | Not in CA | n/a | n/a | Secrets/PII | Owner security only |
| C-MEM-AI | `bancoo:.agents/memory/banco-ai-env-fix.md` | KNOWLEDGE | ✓ | Dummy OPENAI + localhost base URL shadow secrets | Ops note | env | runtime | Misconfig | Check live env; no code |
| C-MEM-EMAIL | `bancoo:.agents/memory/banco-email-completeness.md` | VERIFY | ✓ | Claims 9 NotificationCategory emails | Diff EmailService on CA before any change | email | API | Medium | Read-only CA verify |
| C-MEM-PERF | `bancoo:.agents/memory/banco-mobile-perf.md` | DEFER | ✓ | FlatList windowSize patterns | May overlap CA | RN | UI | Perf invent risk | Device jank proof |
| C-MEM-WEB | `bancoo:.agents/memory/banco-web-export-deploy.md` | KNOWLEDGE | ✓ | Clerk origin white-screen; double `/api` | Align with CA serve | Clerk | Web | High if ignored | Docs for laptop |
| C-MEM-PUSH | `bancoo:.agents/memory/github-push-auth-stale.md` | META | ✓ | Explains commit-tree handoff / no history | Explains orphan | git | n/a | None | Keep as history meta |
| C-WEB-BASE | bancoo `app.config.ts` EXPO_WEB_BASE_URL experiments | VERIFY | ✓ | Path-prefix web export | Absent on CA app.config (+11 lines on bancoo) | Expo web | Replit web | Medium | Compare build.js/serve.js on CA |
| C-AWS-EB | aws-virgen unique EB/Dockerfile commits | KNOWLEDGE | ✓ | Elastic Beanstalk packaging | Not in CA product tip | AWS | Deploy | Low for mobile | AWS lane only |
| C-BANCOO-RESET | Reset CA → bancoo tip | **REJECT** | ✓ | Would drop §5 CA repairs + chain gate | Tree diff proves CA ahead on priorities | all | break | **CRITICAL** | Never |

## Card workflow (mandatory before any future code)

1. Locate → 2. Understand → 3. Compare → 4. Dependency check → 5. Compatibility → 6. Risk → 7. Owner approval → 8. Only then implement.
