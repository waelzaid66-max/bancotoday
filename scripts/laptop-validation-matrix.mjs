#!/usr/bin/env node
/**
 * Laptop / CI validation matrix — Production Execution & Validation Standard.
 * Runs every check that is possible in the current environment.
 * Writes reports/laptop-validation-results.json (PASS|FAIL|BLOCKED|SKIP only).
 *
 * Usage (from repo root, after pnpm install --frozen-lockfile):
 *   node scripts/laptop-validation-matrix.mjs
 *   node scripts/laptop-validation-matrix.mjs --with-install
 *   node scripts/laptop-validation-matrix.mjs --prod-url https://YOUR_API_HOST
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const withInstall = process.argv.includes("--with-install");
const prodUrlIdx = process.argv.indexOf("--prod-url");
const prodUrl =
  prodUrlIdx >= 0 ? String(process.argv[prodUrlIdx + 1] || "").replace(/\/+$/, "") : "";

const results = [];

function rec(id, status, detail = "") {
  results.push({ id, status, detail: String(detail).slice(0, 2000) });
  const mark = status === "PASS" ? "PASS" : status;
  console.log(`[${mark}] ${id}${detail ? `: ${String(detail).split("\n")[0].slice(0, 160)}` : ""}`);
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    cwd: opts.cwd || ROOT,
    encoding: "utf8",
    env: { ...process.env, ...(opts.env || {}) },
    timeout: opts.timeout ?? 600_000,
  });
  return {
    ok: r.status === 0,
    status: r.status ?? 1,
    out: `${r.stdout ?? ""}${r.stderr ?? ""}`.trim(),
  };
}

function git(args) {
  return run("git", args).out.trim();
}

const HEAD = git(["rev-parse", "HEAD"]);
const SHORT = HEAD.slice(0, 7);
const BRANCH = git(["rev-parse", "--abbrev-ref", "HEAD"]);
const nodeModules = fs.existsSync(path.join(ROOT, "node_modules"));

rec("identity.repo", "PASS", "waelzaid66-max/-BANCO-CA-OOM-");
rec("identity.branch", "PASS", BRANCH);
rec("identity.sha", "PASS", HEAD);

// 1) Source integrity
{
  const r = run("node", ["scripts/chain-integrity-gate.mjs"]);
  rec("source.chain_integrity", r.ok ? "PASS" : "FAIL", r.out.split("\n").slice(-3).join(" | "));
}
{
  const r = run("node", ["scripts/verify-gcp-docker-build-config.mjs"]);
  rec("deploy.gcp_docker_config", r.ok ? "PASS" : "FAIL", r.out.split("\n").slice(-2).join(" | "));
}

// 2) Mobile static suites (no deps)
{
  const r = run("node", [
    "--test",
    "artifacts/banco-mobile/tests/lib-hardening.test.mjs",
    "artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs",
    "artifacts/banco-mobile/tests/mobile-resilience.test.mjs",
  ]);
  const passLine = r.out.split("\n").find((l) => l.startsWith("# pass ")) || "";
  rec("mobile.node_static_suites", r.ok ? "PASS" : "FAIL", passLine || r.out.slice(-200));
}

// 3) Optional install
if (withInstall) {
  const r = run("pnpm", ["install", "--frozen-lockfile"]);
  rec("deps.pnpm_install_frozen", r.ok ? "PASS" : "FAIL", r.out.slice(-500));
} else if (!nodeModules) {
  rec(
    "deps.pnpm_install_frozen",
    "BLOCKED",
    "node_modules missing — re-run with --with-install on laptop/CI",
  );
} else {
  rec("deps.pnpm_install_frozen", "PASS", "node_modules present (install not re-run)");
}

const canPnpm = fs.existsSync(path.join(ROOT, "node_modules"));

function pnpmOrBlock(id, args, cwd) {
  if (!canPnpm) {
    rec(id, "BLOCKED", "requires node_modules");
    return;
  }
  const r = run("pnpm", args, { cwd });
  rec(id, r.ok ? "PASS" : "FAIL", r.out.slice(-800));
}

pnpmOrBlock("validate.typecheck", ["run", "typecheck"]);
pnpmOrBlock("validate.eslint_scripts", ["run", "lint"]);
pnpmOrBlock("validate.mobile_full_test", ["run", "test"], path.join(ROOT, "artifacts/banco-mobile"));
pnpmOrBlock("validate.api_unit", ["--filter", "@workspace/api-server", "run", "test"]);
pnpmOrBlock("validate.admin_typecheck", ["--filter", "@workspace/admin-os", "run", "typecheck"]);
pnpmOrBlock("validate.dealer_typecheck", ["--filter", "@workspace/dealer-os", "run", "typecheck"]);
pnpmOrBlock("validate.web_typecheck", ["--filter", "@workspace/banco-web", "run", "typecheck"]);
pnpmOrBlock("validate.landing_typecheck", ["--filter", "@workspace/landing", "run", "typecheck"]);

// Builds (heavier — still mandatory when deps exist)
pnpmOrBlock("build.api", ["--filter", "@workspace/api-server", "run", "build"]);
pnpmOrBlock("build.admin", ["--filter", "@workspace/admin-os", "run", "build"]);
pnpmOrBlock("build.dealer", ["--filter", "@workspace/dealer-os", "run", "build"]);

// F1 live probe
if (prodUrl) {
  try {
    const res = await fetch(`${prodUrl}/api/readyz`, { signal: AbortSignal.timeout(15000) });
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text.slice(0, 500) };
    }
    const ok = res.ok && body && body.status;
    rec(
      "production.readyz",
      ok ? "PASS" : "FAIL",
      JSON.stringify({ http: res.status, gitSha: body.gitSha ?? null, buildId: body.buildId ?? null, status: body.status }),
    );
    if (body.gitSha) {
      rec(
        "production.readyz_sha_matches_head",
        String(body.gitSha).startsWith(SHORT) || body.gitSha === HEAD ? "PASS" : "FAIL",
        `live=${body.gitSha} head=${HEAD}`,
      );
    } else {
      rec("production.readyz_sha_matches_head", "FAIL", "gitSha null — image may predate deploy-pin bake");
    }
  } catch (e) {
    rec("production.readyz", "FAIL", e instanceof Error ? e.message : String(e));
    rec("production.readyz_sha_matches_head", "BLOCKED", "readyz fetch failed");
  }
} else {
  rec("production.readyz", "BLOCKED", "pass --prod-url https://HOST");
  rec("production.readyz_sha_matches_head", "BLOCKED", "pass --prod-url https://HOST");
}

// bancooom emptiness check (read-only via git ls-remote if possible)
{
  const r = run("git", ["ls-remote", "https://github.com/waelzaid66-max/bancooom.git", "HEAD"]);
  if (!r.ok || !r.out.trim()) {
    rec("deploy.bancooom_has_main", "FAIL", "empty or unreachable — sync required from CA-OOM");
  } else {
    const sha = r.out.trim().split(/\s+/)[0];
    rec(
      "deploy.bancooom_has_main",
      "PASS",
      `bancooom HEAD=${sha}${sha === HEAD ? " (matches local HEAD)" : " (differs from local HEAD — verify sync)"}`,
    );
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  repository: "waelzaid66-max/-BANCO-CA-OOM-",
  branch: BRANCH,
  commit: HEAD,
  productionAccepted: false,
  counts: {
    PASS: results.filter((r) => r.status === "PASS").length,
    FAIL: results.filter((r) => r.status === "FAIL").length,
    BLOCKED: results.filter((r) => r.status === "BLOCKED").length,
    SKIP: results.filter((r) => r.status === "SKIP").length,
  },
  results,
};

summary.productionCandidate =
  summary.counts.FAIL === 0 &&
  results.some((r) => r.id === "validate.typecheck" && r.status === "PASS") &&
  results.some((r) => r.id === "production.readyz" && r.status === "PASS");

if (summary.productionCandidate) {
  summary.productionAccepted = false; // still requires owner Final Acceptance Review
  summary.note =
    "All automated checks green including live readyz — still NOT auto-accepted; owner Final Acceptance required.";
} else {
  summary.note = "Not a production candidate — see FAIL/BLOCKED rows.";
}

const outPath = path.join(ROOT, "reports", "laptop-validation-results.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(summary, null, 2) + "\n");

console.log("\n=== SUMMARY ===");
console.log(JSON.stringify(summary.counts, null, 2));
console.log(`Wrote ${path.relative(ROOT, outPath)}`);
console.log(`productionCandidate=${summary.productionCandidate} productionAccepted=${summary.productionAccepted}`);

if (summary.counts.FAIL > 0) process.exit(1);
