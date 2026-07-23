# F0 / F1 — Evidence Recommendation (Owner Decision Support)

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



## Question F0 — What is the live primary?

| Option | Repo | Live evidence (this session) | Verdict |
|--------|------|------------------------------|---------|
| **A** | `-BANCO-CA-OOM-` | tip `7c74602`, pushed 2026-07-21, size≈36525, **has** `chain-integrity-gate`, 238 commits since wipe `93b650b` | **BEST = Engineering + product source of truth** |
| **B** | `bancoo` | tip `321af02` orphan handoff; **missing** chain-integrity-gate; claims source `93f2c7e` | **REJECT as primary** (knowledge/quarantine only) |
| **C** | `bancooom` | GitHub **empty** (size 0, no commits); documented GCP deploy name only | **BEST = GCP deploy mirror AFTER sync from A** — not an independent product tree today |
| **D** | Paste live `/api/readyz` | All probed URLs BLOCKED from this VM (TLS reset / DNS) | **Still required for F1** — cannot replace A/B/C study |

### Recommended F0 policy (preserves everything)

1. **Keep coding / CI / repairs on A (`-BANCO-CA-OOM-` `main`).**  
2. **Treat C (`bancooom`) as deploy-only mirror:** run `scripts/publish-bancooom-deploy.sh` (or Sync bancooom workflow) so GCP triggers never embed `-banco-ca-oom-` OCI path (exit 125).  
3. **Never reset A to B (`bancoo`).** That deletes integrity gates and regresses N0–N2/C1–C3.  
4. **aws-virgen** stays optional AWS mirror — currently stale vs A.

### Why this preserves “كل ما يلي”
- No wipe of Stay/Cars / SECTION_ROUTE / FI rules / chain markers.  
- No blind import from bancoo.  
- GCP naming constraint satisfied **without** abandoning the repair line.

---

## Question F1 — Which SHA is live in production?

| Check | Result |
|-------|--------|
| Code supports `gitSha`/`buildId` on `/api/readyz` | PASS (source @ `7c74602`) |
| Docker bake `GIT_SHA`/`BUILD_ID` | PASS (Dockerfiles + Cloud Build args) |
| Live `GET /api/readyz` from agent network | **BLOCKED** — see probes in fingerprint |
| `bancooom` contents match A | **FAIL / EMPTY** — sync not done since 2026-07-09 |

### Recommended F1 procedure (owner/ops)

```bash
# On machine with BANCOOOM_SYNC_TOKEN:
./scripts/publish-bancooom-deploy.sh
# Then Cloud Build deploy from bancooom
# Then:
curl -sS "$PROD_API/api/readyz" | jq .
# Expect: gitSha == the CA-OOM SHA that was synced/deployed
```

Until that JSON is pasted, **F1 = BLOCKED** (not FAIL of application logic — environment/ops gap).

