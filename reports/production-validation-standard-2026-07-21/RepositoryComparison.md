# Repository Comparison

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



```json
{
  "CA-OOM": {
    "fullName": "waelzaid66-max/-BANCO-CA-OOM-",
    "tip": "7c74602fbbc0e7ecaa65f945ebbefb1e29de73aa",
    "pushedAt": "2026-07-21T22:11:14Z",
    "sizeKbApprox": 36525,
    "chainIntegrityGate": true,
    "role": "ENGINEERING_SOURCE_OF_TRUTH"
  },
  "bancooom": {
    "fullName": "waelzaid66-max/bancooom",
    "tip": null,
    "pushedAt": "2026-07-09T13:17:54Z",
    "sizeKbApprox": 0,
    "empty": true,
    "chainIntegrityGate": false,
    "role": "GCP_DEPLOY_MIRROR_INTENDED_BUT_EMPTY",
    "evidence": "GitHub size=0; shallow clone warns empty repository; no main commits"
  },
  "bancoo": {
    "fullName": "waelzaid66-max/bancoo",
    "tip": "321af022a0b6a38a7fe0a0480353f45be2c5499b",
    "pushedAt": "2026-07-21T14:53:30Z",
    "sizeKbApprox": 11836,
    "empty": false,
    "chainIntegrityGate": false,
    "role": "ORPHAN_HANDOFF_DUMP_KNOWLEDGE_ONLY",
    "evidence": "Commit message claims source 93f2c7e; missing scripts/chain-integrity-gate.mjs; whole-tree merge would regress CA-OOM repairs"
  },
  "aws-virgen": {
    "fullName": "waelzaid66-max/aws-virgen",
    "tip": "d386f527e58f22defa5ebc6b1b14ac79220cc373",
    "pushedAt": "2026-07-10T15:55:09Z",
    "role": "AWS_MIRROR_STALE",
    "evidence": "Last tip Jul 10 sync manifest — behind CA-OOM HEAD"
  }
}
```

## Import policy
See `audit/BANCOO-IMPORT-BOARD-ZERO-BLIND-2026-07-21-AR.md`. Whole-tree merge from bancoo = **FORBIDDEN**.

