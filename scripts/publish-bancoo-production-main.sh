#!/usr/bin/env bash
# Publish the verified production tree INTO waelzaid66-max/bancoo (owner-declared MAIN).
#
# WHY THIS EXISTS
#   bancoo@321af02 is a 1-commit orphan handoff (history stripped). It is missing
#   CA-OOM Jul-21 production repairs (profile /me.role, upload update 503, map
#   centers, chain gate, etc.) while CA already re-imported bancoo's web stack
#   (ClerkLoadGate + exportWebBuild). To make bancoo the definitive Production
#   MAIN without feature loss, sync the verified working-line tip INTO bancoo,
#   preserving bancoo-only sealed artifacts (SQL dump + unique memory notes).
#
# REQUIREMENTS
#   - Run from -BANCO-CA-OOM- (or any clone whose origin/main is the verified tip)
#   - BANCOO_PRODUCTION_SYNC_TOKEN (or GITHUB_TOKEN) with push to bancoo
#   - CONFIRM_BANCOO_FORCE=YES  (required — force-updates bancoo main)
#
# USAGE
#   CONFIRM_BANCOO_FORCE=YES BANCOO_PRODUCTION_SYNC_TOKEN=ghp_... \
#     ./scripts/publish-bancoo-production-main.sh [tag-name]
#
# DOES NOT
#   - Modify secrets
#   - Drop the quarantined dump without copying it forward
#   - Blind-merge unrelated branches
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! git remote get-url origin &>/dev/null; then
  echo "Run from the BANCO monorepo root." >&2
  exit 1
fi

if [[ "${CONFIRM_BANCOO_FORCE:-}" != "YES" ]]; then
  echo "Refusing to force-update bancoo main without CONFIRM_BANCOO_FORCE=YES" >&2
  exit 2
fi

ORIGIN_URL="$(git remote get-url origin)"
BANCOO_URL="https://github.com/waelzaid66-max/bancoo.git"
TOKEN="${BANCOO_PRODUCTION_SYNC_TOKEN:-${BANCOO_SYNC_TOKEN:-${GITHUB_TOKEN:-}}}"

if [[ -z "$TOKEN" ]]; then
  echo "Set BANCOO_PRODUCTION_SYNC_TOKEN (PAT with push to bancoo)." >&2
  exit 2
fi

strip_git_credentials() {
  local url="$1"
  echo "$url" | sed -E 's#https://[^@]+@#https://#; s#git@[^:]+:([^ ]+)#https://github.com/\1#'
}
auth_url() {
  local url
  url="$(strip_git_credentials "$1")"
  if [[ -n "$TOKEN" && "$url" == https://* ]]; then
    local hostpath="${url#https://}"
    echo "https://x-access-token:${TOKEN}@${hostpath}"
  else
    echo "$url"
  fi
}

echo "[bancoo-main] preflight chain integrity"
node scripts/chain-integrity-gate.mjs

git fetch origin main
SHA="$(git rev-parse origin/main)"
TAG="${1:-production-main-$(date +%Y%m%d)}"

WORKDIR="$(mktemp -d)"
PRESERVE="$(mktemp -d)"
trap 'rm -rf "$WORKDIR" "$PRESERVE"' EXIT

CLONE_URL="$(auth_url "$BANCOO_URL")"
echo "[bancoo-main] clone $(strip_git_credentials "$BANCOO_URL")"
if git clone "$CLONE_URL" "$WORKDIR/repo" 2>/dev/null; then
  :
else
  echo "[bancoo-main] empty or new remote — initializing"
  mkdir -p "$WORKDIR/repo"
  git -C "$WORKDIR/repo" init -b main
  git -C "$WORKDIR/repo" remote add origin "$CLONE_URL"
fi

# Preserve bancoo-only sealed artifacts BEFORE reset (if present on old tip).
OLD="$WORKDIR/repo"
if [[ -f "$OLD/release/banco_dev_dump_2026-07-21.sql.gz" ]]; then
  mkdir -p "$PRESERVE/release"
  cp -a "$OLD/release/banco_dev_dump_2026-07-21.sql.gz" "$PRESERVE/release/"
  echo "[bancoo-main] preserved SQL dump (quarantine)"
fi
mkdir -p "$PRESERVE/.agents/memory"
for f in \
  banco-ai-env-fix.md \
  banco-email-completeness.md \
  banco-mobile-perf.md \
  banco-web-export-deploy.md \
  github-push-auth-stale.md
 do
  if [[ -f "$OLD/.agents/memory/$f" ]]; then
    cp -a "$OLD/.agents/memory/$f" "$PRESERVE/.agents/memory/"
    echo "[bancoo-main] preserved memory $f"
  fi
done

cd "$WORKDIR/repo"
BANCO_FETCH="$(auth_url "$ORIGIN_URL")"
git remote remove source 2>/dev/null || true
git remote add source "$BANCO_FETCH"
git fetch source main

echo "[bancoo-main] reset to source/main ($SHA)"
git reset --hard "source/main"

# Re-apply preserved sealed artifacts (no secrets invented; dump stays quarantine).
if [[ -d "$PRESERVE/release" ]]; then
  mkdir -p release
  cp -a "$PRESERVE/release/." release/
fi
if [[ -d "$PRESERVE/.agents/memory" ]] && [[ -n "$(ls -A "$PRESERVE/.agents/memory" 2>/dev/null || true)" ]]; then
  mkdir -p .agents/memory
  cp -a "$PRESERVE/.agents/memory/." .agents/memory/
fi

if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  git -c user.email="banco-production-sync@local" -c user.name="BANCO Production Sync" \
    commit -m "chore(production-main): preserve bancoo sealed dump + memory notes on synced tip $SHA"
fi

git tag -a "$TAG" -m "BANCO production MAIN snapshot ($TAG) from $SHA" 2>/dev/null \
  || git tag -f -a "$TAG" -m "BANCO production MAIN snapshot ($TAG) from $SHA"

PUSH_URL="$(auth_url "$BANCOO_URL")"
git remote set-url origin "$PUSH_URL"

echo "[bancoo-main] force-push main + tag $TAG"
git push -u origin main --force
git push origin "$TAG" --force

echo "[bancoo-main] DONE"
echo "  bancoo HEAD = $(git rev-parse HEAD)"
echo "  source SHA  = $SHA"
echo "  tag         = $TAG"
echo "  NEXT: run laptop-validation-matrix + deploy smoke; do not declare ready without runtime proof."
