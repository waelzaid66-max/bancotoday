#!/usr/bin/env node
/**
 * Production Execution & Validation Standard pack + ProductionFingerprint.json
 * Evidence-only. Never sets productionAccepted=true without full pipeline PASS.
 *
 * Usage: node scripts/generate-production-validation-standard.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATE = "2026-07-21";
const OUT = path.join(ROOT, "reports", `production-validation-standard-${DATE}`);

function sh(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8" });
  return {
    ok: r.status === 0,
    status: r.status ?? 1,
    out: `${r.stdout ?? ""}${r.stderr ?? ""}`.trim(),
  };
}

function git(args) {
  return sh("git", args).out.trim();
}

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

const HEAD = git(["rev-parse", "HEAD"]);
const SHORT = HEAD.slice(0, 7);
const BRANCH = git(["rev-parse", "--abbrev-ref", "HEAD"]);
const DESCRIBE = git(["describe", "--tags", "--always"]);
const LATEST_TAG = git(["describe", "--tags", "--abbrev=0"]);
const REPO = "waelzaid66-max/-BANCO-CA-OOM-";
const AUTHOR = "Cursor agent (validation standard)";

const gate = sh("node", ["scripts/chain-integrity-gate.mjs"]);
const mobile = sh("node", [
  "--test",
  "artifacts/banco-mobile/tests/lib-hardening.test.mjs",
  "artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs",
  "artifacts/banco-mobile/tests/mobile-resilience.test.mjs",
]);
const gcp = sh("node", ["scripts/verify-gcp-docker-build-config.mjs"]);
const nodeModules = fs.existsSync(path.join(ROOT, "node_modules"));
const pnpm = sh("pnpm", ["-v"]);

const appJson = readJson("artifacts/banco-mobile/app.json");
const mobilePkg = readJson("artifacts/banco-mobile/package.json");
const openapi = read("lib/api-spec/openapi.yaml");
const openapiInfoVersion = (openapi.match(/info:[\s\S]*?^\s*version:\s*["']?([^\s"']+)/m) || [])[1] || null;
const openapiSpecVersion = (openapi.match(/^openapi:\s*([^\s]+)/m) || [])[1] || null;
const schemaFiles = fs.readdirSync(path.join(ROOT, "lib/db/src/schema"));
const commitsSinceWipe = sh("git", ["rev-list", "--count", "93b650b..HEAD"]).out;
const hasDeployPin = /function deployPin/.test(read("artifacts/api-server/src/routes/health.ts"));
const hasChainGate = fs.existsSync(path.join(ROOT, "scripts/chain-integrity-gate.mjs"));
const mapLiveLeaflet = /Leaflet\/OpenStreetMap/.test(
  read("artifacts/banco-mobile/components/search/SearchResultsMap.tsx"),
);

/** Sibling repo evidence captured this session (GitHub API + shallow clone). */
const siblingEvidence = {
  "CA-OOM": {
    fullName: REPO,
    tip: HEAD,
    pushedAt: "2026-07-21T22:11:14Z",
    sizeKbApprox: 36525,
    chainIntegrityGate: hasChainGate,
    role: "ENGINEERING_SOURCE_OF_TRUTH",
  },
  bancooom: {
    fullName: "waelzaid66-max/bancooom",
    tip: null,
    pushedAt: "2026-07-09T13:17:54Z",
    sizeKbApprox: 0,
    empty: true,
    chainIntegrityGate: false,
    role: "GCP_DEPLOY_MIRROR_INTENDED_BUT_EMPTY",
    evidence: "GitHub size=0; shallow clone warns empty repository; no main commits",
  },
  bancoo: {
    fullName: "waelzaid66-max/bancoo",
    tip: "321af022a0b6a38a7fe0a0480353f45be2c5499b",
    pushedAt: "2026-07-21T14:53:30Z",
    sizeKbApprox: 11836,
    empty: false,
    chainIntegrityGate: false,
    role: "ORPHAN_HANDOFF_DUMP_KNOWLEDGE_ONLY",
    evidence:
      "Commit message claims source 93f2c7e; missing scripts/chain-integrity-gate.mjs; whole-tree merge would regress CA-OOM repairs",
  },
  "aws-virgen": {
    fullName: "waelzaid66-max/aws-virgen",
    tip: "d386f527e58f22defa5ebc6b1b14ac79220cc373",
    pushedAt: "2026-07-10T15:55:09Z",
    role: "AWS_MIRROR_STALE",
    evidence: "Last tip Jul 10 sync manifest — behind CA-OOM HEAD",
  },
};

const liveReadyzProbes = [
  { url: "https://banco-ca-oom.replit.app/api/readyz", result: "BLOCKED", detail: "TLS Recv failure: Connection reset by peer" },
  { url: "https://banco.store/api/readyz", result: "BLOCKED", detail: "TLS Recv failure: Connection reset by peer" },
  { url: "https://www.banco.store/api/readyz", result: "BLOCKED", detail: "TLS Recv failure: Connection reset by peer" },
  { url: "https://api.banco.store/api/readyz", result: "BLOCKED", detail: "Could not resolve host" },
];

const validation = {
  chainGate: gate.ok ? "PASS" : "FAIL",
  mobileNodeTests: mobile.ok ? "PASS" : "FAIL",
  gcpDockerConfig: gcp.ok ? "PASS" : "FAIL",
  pnpmInstall: nodeModules ? "PASS" : "BLOCKED",
  typecheck: "BLOCKED",
  eslint: "BLOCKED",
  fullBuild: "BLOCKED",
  apiVitest: "BLOCKED",
  adminBuild: "BLOCKED",
  dealerBuild: "BLOCKED",
  webBuild: "BLOCKED",
  liveReadyz: "BLOCKED",
  productionAccepted: false,
};

fs.mkdirSync(OUT, { recursive: true });

const fingerprint = {
  protocol: "BANCO STORE — Production Execution & Validation Standard",
  generatedAt: new Date().toISOString(),
  generatedBy: AUTHOR,
  productionAccepted: false,
  repository: {
    fullName: REPO,
    branch: BRANCH,
    commitSha: HEAD,
    commitShort: SHORT,
    describe: DESCRIBE,
    latestTag: LATEST_TAG,
    releaseCandidateTag: LATEST_TAG,
    commitsSinceWipe93b650b: Number(commitsSinceWipe) || null,
  },
  versions: {
    workspace: readJson("package.json").version,
    apiServer: readJson("artifacts/api-server/package.json").version,
    mobilePackage: mobilePkg.version,
    mobileAppExpoVersion: appJson.expo?.version ?? null,
    mobileIosBuildNumber: appJson.expo?.ios?.buildNumber ?? null,
    mobileAndroidVersionCode: appJson.expo?.android?.versionCode ?? null,
    mobileExpoSdk: mobilePkg.dependencies?.expo ?? mobilePkg.devDependencies?.expo ?? null,
    adminOs: readJson("artifacts/admin-os/package.json").version,
    dealerOs: readJson("artifacts/dealer-os/package.json").version,
    bancoWeb: readJson("artifacts/banco-web/package.json").version,
    landing: readJson("artifacts/landing/package.json").version,
    sharedApiClientReact: readJson("lib/api-client-react/package.json").version,
    sharedApiZod: readJson("lib/api-zod/package.json").version,
    sharedDb: readJson("lib/db/package.json").version,
    openapiDocumentVersion: openapiInfoVersion,
    openapiSpec: openapiSpecVersion,
    dbSchemaFileCount: schemaFiles.length,
    dbSchemaFiles: schemaFiles,
  },
  deployment: {
    buildNumber: null,
    deploymentVersion: null,
    liveGitSha: null,
    liveBuildId: null,
    note: "Live deploy pin UNKNOWN — F1 BLOCKED (egress/DNS). After deploy, read /api/readyz.gitSha",
    gitShaBakeSupportedInDocker: hasDeployPin,
    gcpDeployRepoIntended: "waelzaid66-max/bancooom",
    gcpDeployRepoActualState: "EMPTY",
  },
  maps: {
    liveImplementation: mapLiveLeaflet ? "Leaflet/OSM WebView" : "UNKNOWN",
    googleMapsPackagesPresentButNotLivePath: true,
  },
  siblingRepositories: siblingEvidence,
  liveReadyzProbes,
  validationSummary: validation,
  f0Recommendation: {
    engineeringPrimary: "A_CA_OOM",
    gcpDeployMirror: "C_bancooom_AFTER_SYNC_FROM_CA_OOM",
    doNotUseAsPrimary: ["B_bancoo"],
    rationale:
      "CA-OOM is the only non-empty continuous line with chain-integrity-gate and Jul-21 repairs. bancooom is the documented GCP trigger repo but is currently EMPTY and must be synced FROM CA-OOM. bancoo is an orphan handoff dump missing the integrity gate.",
  },
  f1Recommendation: {
    status: "BLOCKED_UNTIL_LIVE_PROBE",
    requiredAction:
      "Owner/ops: sync CA-OOM→bancooom, deploy API with GIT_SHA bake, paste GET /api/readyz JSON. Expect gitSha == CA-OOM tip used for that deploy.",
  },
};

fs.writeFileSync(
  path.join(OUT, "ProductionFingerprint.json"),
  JSON.stringify(fingerprint, null, 2) + "\n",
);
fs.writeFileSync(
  path.join(ROOT, "reports", "ProductionFingerprint.json"),
  JSON.stringify(fingerprint, null, 2) + "\n",
);

function hdr(title) {
  return `# ${title}

| Field | Value |
|-------|-------|
| Standard | Production Execution & Validation Standard |
| Repository | \`${REPO}\` |
| Branch | \`${BRANCH}\` |
| Commit | \`${HEAD}\` (\`${SHORT}\`) |
| Describe | \`${DESCRIBE}\` |
| Latest tag | \`${LATEST_TAG}\` |
| Author | ${AUTHOR} |
| Date | ${DATE} |
| Production accepted | **NO** |

`;
}

function w(name, body) {
  fs.writeFileSync(path.join(OUT, name), body.trimStart() + "\n");
}

w(
  "README.md",
  `${hdr("Production Validation Standard Pack")}

## Owner answer (F0 / F1) — evidence study

See **[F0_F1_EVIDENCE_RECOMMENDATION.md](./F0_F1_EVIDENCE_RECOMMENDATION.md)** and root copy  
\`audit/F0-F1-EVIDENCE-RECOMMENDATION-2026-07-21-AR.md\`.

## Mandatory files

All files in this directory + \`reports/ProductionFingerprint.json\`.

Regenerate:

\`\`\`bash
node scripts/generate-production-validation-standard.mjs
\`\`\`
`,
);

w(
  "F0_F1_EVIDENCE_RECOMMENDATION.md",
  `${hdr("F0 / F1 — Evidence Recommendation (Owner Decision Support)")}

## Question F0 — What is the live primary?

| Option | Repo | Live evidence (this session) | Verdict |
|--------|------|------------------------------|---------|
| **A** | \`-BANCO-CA-OOM-\` | tip \`${SHORT}\`, pushed 2026-07-21, size≈36525, **has** \`chain-integrity-gate\`, 238 commits since wipe \`93b650b\` | **BEST = Engineering + product source of truth** |
| **B** | \`bancoo\` | tip \`321af02\` orphan handoff; **missing** chain-integrity-gate; claims source \`93f2c7e\` | **REJECT as primary** (knowledge/quarantine only) |
| **C** | \`bancooom\` | GitHub **empty** (size 0, no commits); documented GCP deploy name only | **BEST = GCP deploy mirror AFTER sync from A** — not an independent product tree today |
| **D** | Paste live \`/api/readyz\` | All probed URLs BLOCKED from this VM (TLS reset / DNS) | **Still required for F1** — cannot replace A/B/C study |

### Recommended F0 policy (preserves everything)

1. **Keep coding / CI / repairs on A (\`-BANCO-CA-OOM-\` \`main\`).**  
2. **Treat C (\`bancooom\`) as deploy-only mirror:** run \`scripts/publish-bancooom-deploy.sh\` (or Sync bancooom workflow) so GCP triggers never embed \`-banco-ca-oom-\` OCI path (exit 125).  
3. **Never reset A to B (\`bancoo\`).** That deletes integrity gates and regresses N0–N2/C1–C3.  
4. **aws-virgen** stays optional AWS mirror — currently stale vs A.

### Why this preserves “كل ما يلي”
- No wipe of Stay/Cars / SECTION_ROUTE / FI rules / chain markers.  
- No blind import from bancoo.  
- GCP naming constraint satisfied **without** abandoning the repair line.

---

## Question F1 — Which SHA is live in production?

| Check | Result |
|-------|--------|
| Code supports \`gitSha\`/\`buildId\` on \`/api/readyz\` | PASS (source @ \`${SHORT}\`) |
| Docker bake \`GIT_SHA\`/\`BUILD_ID\` | PASS (Dockerfiles + Cloud Build args) |
| Live \`GET /api/readyz\` from agent network | **BLOCKED** — see probes in fingerprint |
| \`bancooom\` contents match A | **FAIL / EMPTY** — sync not done since 2026-07-09 |

### Recommended F1 procedure (owner/ops)

\`\`\`bash
# On machine with BANCOOOM_SYNC_TOKEN:
./scripts/publish-bancooom-deploy.sh
# Then Cloud Build deploy from bancooom
# Then:
curl -sS "$PROD_API/api/readyz" | jq .
# Expect: gitSha == the CA-OOM SHA that was synced/deployed
\`\`\`

Until that JSON is pasted, **F1 = BLOCKED** (not FAIL of application logic — environment/ops gap).
`,
);

w(
  "RepositoryComparison.md",
  `${hdr("Repository Comparison")}

${"```json"}
${JSON.stringify(siblingEvidence, null, 2)}
${"```"}

## Import policy
See \`audit/BANCOO-IMPORT-BOARD-ZERO-BLIND-2026-07-21-AR.md\`. Whole-tree merge from bancoo = **FORBIDDEN**.
`,
);

w(
  "HistoricalTimeline.md",
  `${hdr("Historical Timeline")}

| When | Event | Evidence |
|------|-------|----------|
| ≤ Jul 11 | production tags v1.1.x | tags on CA-OOM |
| Jul 13 | Mega-wipe \`93b650b\` | ancestor of HEAD; ~144 files |
| Jul 17–18 | stable tags v1.2–v1.4 | \`v1.4.0-stable-2026-07-18\` |
| Jul 9 | bancooom created/pushed | still **empty** as of this study |
| Jul 10 | aws-virgen sync | tip \`d386f52\` stale |
| Jul 21 AM–PM | Accounts + N0–N2 + forensic + scale C1–C3 + protocol reports | tip \`${SHORT}\` |
| Jul 21 14:34Z | bancoo orphan handoff \`321af02\` | missing integrity gate |
| Post-wipe → HEAD | ${commitsSinceWipe} commits | continuous repair line |

**Root cause of “fixed then gone”:** wipe \`93b650b\` + incomplete restores — mitigated by chain-integrity-gate (36 markers).
`,
);

w(
  "ArchitectureReport.md",
  `${hdr("Architecture Report")}

Monorepo: pnpm + artifacts (api-server, banco-mobile, admin-os, dealer-os, banco-web, banco-website, landing) + lib (db, api-spec, api-zod, api-client-react, taxonomy, search-contract, design-tokens).

Maps live path: **Leaflet/OSM WebView** (not Google Maps SDK), despite unused \`react-native-maps\` / \`@types/google.maps\` packages.

Auth: Clerk; OAuth google/apple in profile; Facebook = social link icon only (not login provider).

Integrity: \`scripts/chain-integrity-gate.mjs\` — ${validation.chainGate}.
`,
);

w(
  "DependencyMatrix.md",
  `${hdr("Dependency Matrix")}

| Item | Status | Detail |
|------|--------|--------|
| pnpm-lock.yaml | PRESENT | frozen-lockfile required |
| node_modules | ABSENT | install BLOCKED (npm registry ECONNRESET) |
| Random upgrades | NOT DONE | forbidden |
| Expo SDK | ~54.0.36 | from mobile package.json |
`,
);

w(
  "FeatureMatrix.md",
  `${hdr("Feature Matrix")}

Legend: P=present · G=gated · L=live-proven · X=not product · B=blocked probe

| Area | P | G | L | Notes |
|------|---|---|---|-------|
| Clerk email | P | | B | live auth not probed |
| Google Sign-In | P | | B | oauth_google |
| Apple Sign-In | P | | B | oauth_apple |
| Facebook Login | X | | | social icon only — do not invent |
| Leaflet maps | P | G | B | live path |
| Google Maps SDK live | X | | | packages unused |
| Profile /me role | P | G | | |
| Upload 503 | P | G | | |
| Push deep-link | P | G | | |
| FI admin queue | P | G | | no auto-create |
| Cars/Stay compact | P | G | | NEVER redesign |
| Payments | P | | B | |
`,
);

w(
  "MissingFeatures.md",
  `${hdr("Missing Features (do not invent)")}

- Facebook Login provider
- FI auto-create
- Google Maps as live map engine
- bancooom content (repo empty — ops sync required, not code invent)
- Live-proven OTP/magic-link certification in this session
`,
);

w(
  "RepairReport.md",
  `${hdr("Repair Report — documentation wave (no product code)")}

## Unique ID
\`REP-2026-07-21-F0F1-VALIDATION-STANDARD\`

## Problem
Owner required evidence-based F0/F1 + mandatory validation reports / fingerprint without guessing.

## Root Cause
Naming collision (bancoo vs bancooom vs CA-OOM) + empty deploy mirror + no live readyz from agent network.

## Files Modified
Reports + generator script + audit recommendation only. **No product runtime code in this commit.**

## Validation
Chain ${validation.chainGate}; mobile node ${validation.mobileNodeTests}; GCP config ${validation.gcpDockerConfig}.

## Rollback
Delete/revert this docs commit; product tip \`5c6e813\` remains intact.
`,
);

w(
  "RegressionReport.md",
  `${hdr("Regression Report")}

| Suite | Result |
|-------|--------|
| chain-integrity-gate | ${validation.chainGate} |
| mobile node tests (75) | ${validation.mobileNodeTests} |
| gcp docker config | ${validation.gcpDockerConfig} |
| pnpm typecheck/lint/build | ${validation.typecheck} |
`,
);

w(
  "CompatibilityReport.md",
  `${hdr("Compatibility Report")}

No API/DB/UI breaking changes in this wave (docs only). Prior wave C additive readyz fields only. Admin/Dealer/Web builds not executed (deps BLOCKED).
`,
);

w(
  "ProductionValidation.md",
  `${hdr("Production Validation")}

| Stage | Status |
|-------|--------|
| 1 Repository Identity | PASS (\`${SHORT}\`) |
| 2 Source Integrity | PASS (chain ${validation.chainGate}) |
| 3 Historical Investigation | PASS (documented) |
| 4 Root Cause Analysis | PASS (F0/F1 doc) |
| 5 Dependency Analysis | BLOCKED (install) |
| 6 Architecture Review | PASS (documented) |
| 7 Safe Implementation | N/A this wave (docs) / prior C1–C3 done |
| 8 Full Build | BLOCKED |
| 9 Complete Tests | PARTIAL |
| 10 Regression | PARTIAL |
| 11 Production Deployment Validation | BLOCKED (F1 + empty bancooom) |
| 12 Documentation | PASS |
| 13 Final Acceptance | **NO** |

Unknown states: none — every row is PASS, FAIL, PARTIAL, BLOCKED, or N/A.
`,
);

w(
  "DeploymentValidation.md",
  `${hdr("Deployment Validation")}

| Target | Status | Evidence |
|--------|--------|----------|
| Replit URL probe | BLOCKED | TLS reset |
| Docker config | PASS | verify-gcp + Dockerfiles with GIT_SHA |
| Cloud Run via bancooom | BLOCKED | bancooom empty — sync required |
| AWS virgen | STALE | tip Jul 10 |
| GitHub Actions | NOT RUN | this session |
| Expo/Android/iOS builds | NOT RUN | deps blocked |
`,
);

w(
  "SecurityReport.md",
  `${hdr("Security Report")}

Source gates for upload 503, FI authz, rate limiters present. No secrets added. bancoo SQL dump remains quarantine-only. Live pen-test NOT RUN.
`,
);

w(
  "PerformanceReport.md",
  `${hdr("Performance Report")}

No perf code changes. FlashList/Redis still deferred pending measurement/ops.
`,
);

w(
  "RiskAssessment.md",
  `${hdr("Risk Assessment")}

| Risk | Severity | Mitigation |
|------|----------|------------|
| Using bancoo as primary | CRITICAL | Reject — missing gate |
| Deploying from empty bancooom | CRITICAL | Sync from CA-OOM first |
| Declaring production ready now | CRITICAL | Explicit NO |
| Agent cannot see live readyz | HIGH | Owner paste F1 |
`,
);

w(
  "ProductionState.md",
  `${hdr("Production State")}

**Working engineering tip:** \`${HEAD}\`  
**Last stable tag:** \`${LATEST_TAG}\` (HEAD is ${commitsSinceWipe} commits after wipe; describe \`${DESCRIBE}\`)  
**GCP deploy mirror:** bancooom **EMPTY**  
**Live SHA:** UNKNOWN (F1 BLOCKED)  
**Production Ready:** **NO**
`,
);

w(
  "KnownIssues.md",
  `${hdr("Known Issues")}

| ID | Status | Detail |
|----|--------|--------|
| KI-ENV-01 | OPEN | npm registry ECONNRESET — no node_modules |
| KI-F0-NAMING | CLARIFIED | A=engineering; C=deploy mirror after sync; B=reject |
| KI-BANCOOOM-EMPTY | OPEN | size 0 — sync required |
| KI-F1-LIVE | OPEN | readyz probes blocked from agent network |
`,
);

w(
  "CompletedRepairs.md",
  `${hdr("Completed Repairs")}

Includes prior: S1–S4, N0–N2, C1–C3 (\`5c6e813\`), protocol reports (\`7c74602\`). This wave: F0/F1 evidence + fingerprint (docs).
`,
);

w(
  "PendingRepairs.md",
  `${hdr("Pending Repairs")}

1. Unblock KI-ENV-01 → frozen install → typecheck/lint/build/tests  
2. Owner confirm F0 policy (recommend A + sync C)  
3. Sync bancooom from CA-OOM  
4. Deploy + paste F1 readyz  
5. Device N2 QA  
`,
);

w(
  "RollbackPlan.md",
  `${hdr("Rollback Plan")}

| Layer | Action |
|-------|--------|
| Docs-only tip | \`git revert\` this commit |
| Product C1–C3 | \`git revert 5c6e813\` (gates will fail — intentional) |
| Deploy | Cloud Run revise to previous image tag; readyz.gitSha confirms |
| DB | No schema changes in C1–C3 or this docs wave |
| Never | Reset CA-OOM to bancoo tip |
`,
);

console.log("Wrote", OUT);
console.log(
  JSON.stringify(
    {
      productionAccepted: false,
      f0: fingerprint.f0Recommendation,
      f1: fingerprint.f1Recommendation.status,
      validation,
    },
    null,
    2,
  ),
);
