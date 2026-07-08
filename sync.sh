#!/bin/bash
# OSUEP monorepo → split-stack deploy sync
#
# This script mirrors:
#   /workspace/osuep-platform/apps/api   →  /workspace/osuep-api-deploy
#   /workspace/osuep-platform/apps/web   →  /workspace/osuep-web-deploy
#   /workspace/osuep-platform/packages/* →  inlined into both deploy repos
#
# Usage:
#   ./sync.sh <api|web|both>
#
# What it does:
#   1. rsyncs the source tree (excluding node_modules, dist, .next, .git)
#   2. Rewrites `@osuep/*` imports to relative paths (deploy repos are self-contained)
#   3. Writes the deploy-specific files (package.json, tsconfig, next.config, etc.) — these are hand-maintained
#   4. Commits + pushes to the deploy repo's GitHub origin
#
# Design notes:
#   - The deploy repos are mirrors, NOT direct copies. Their package.json/tsconfig differ from the monorepo.
#   - Do NOT regenerate package.json from the monorepo. The deploy repos have specific pinning, scripts, and dependencies that Render needs (see notes in memory).

set -e

MONOREPO=/workspace/osuep-platform
API_DEPLOY=/workspace/osuep-api-deploy
WEB_DEPLOY=/workspace/osuep-web-deploy

GITHUB_PAT=$(cat ${HOME:-/root}/.osuep-github-pat 2>/dev/null || echo "${GITHUB_PAT:-}")
if [ -z "$GITHUB_PAT" ]; then
  echo "ERROR: GITHUB_PAT env not set. Add it via the secret tool before running."
  exit 1
fi

CMD=${1:-both}

sync_api() {
  echo "════════════════════════════════════════"
  echo " Syncing API: monorepo → osuep-api-deploy"
  echo "════════════════════════════════════════"

  # 1. Mirror src tree (no rsync available)
  rm -rf "$API_DEPLOY/src"
  mkdir -p "$API_DEPLOY/src"
  cp -r "$MONOREPO/apps/api/src/." "$API_DEPLOY/src/"

  # 2. Inline the workspace packages as src/db and src/auth
  #    (deploy repos have no pnpm workspace; packages must be flattened)
  #    cp CONTENTS of packages/db/src into deploy/src/db (not the packages/db dir itself)
  if [ -d "$MONOREPO/packages/db/src" ]; then
    rm -rf "$API_DEPLOY/src/db"
    mkdir -p "$API_DEPLOY/src/db"
    cp -r "$MONOREPO/packages/db/src/." "$API_DEPLOY/src/db/"
  fi
  if [ -d "$MONOREPO/packages/auth/src" ]; then
    rm -rf "$API_DEPLOY/src/auth"
    mkdir -p "$API_DEPLOY/src/auth"
    cp -r "$MONOREPO/packages/auth/src/." "$API_DEPLOY/src/auth/"
  fi

  # 3. Rewrite @osuep/* → relative imports
  cd "$API_DEPLOY"
  find src -name '*.ts' -print0 | xargs -0 sed -i \
    -e "s|from '@osuep/db'|from '../db/index.js'|g" \
    -e "s|from '@osuep/db/|from '../db/|g" \
    -e "s|from '@osuep/auth'|from '../auth/index.js'|g" \
    -e "s|from '@osuep/types'|from '../types/index.js'|g" || true

  # Also strip type versions like '@/types/index.js' that Next.js uses
  # Note: the API uses '@osuep/*' workspace imports; web uses '@/...' TS path aliases differently.

  # 4. Quick typecheck before commit (catches broken rewrites)
  echo "  → typecheck..."
  # Make sure node_modules is up to date so TS can resolve
  if [ ! -d node_modules ]; then
    npm ci --silent
  fi
  if ! npx tsc --noEmit > /tmp/sync-api-typecheck.log 2>&1; then
    echo "  ✗ Typecheck failed. See /tmp/sync-api-typecheck.log"
    tail -30 /tmp/sync-api-typecheck.log
    exit 1
  fi

  # 5. Commit + push
  git add -A
  if git diff --cached --quiet; then
    echo "  → no changes"
  else
    git commit -m "sync: from monorepo $(date +%Y-%m-%dT%H:%M:%S)"
    git push origin main
    echo "  → pushed"
  fi

  cd - > /dev/null
  echo "  ✓ API sync done"
}

sync_web() {
  echo "════════════════════════════════════════"
  echo " Syncing Web: monorepo → osuep-web-deploy"
  echo "════════════════════════════════════════"

  rm -rf "$WEB_DEPLOY/src"
  mkdir -p "$WEB_DEPLOY/src"
  cp -r "$MONOREPO/apps/web/src/." "$WEB_DEPLOY/src/"
  # public assets
  if [ -d "$MONOREPO/apps/web/public" ]; then
    cp -r "$MONOREPO/apps/web/public" "$WEB_DEPLOY/public"
  fi

  cd "$WEB_DEPLOY"
  echo "  → typecheck..."
  if ! npx tsc --noEmit > /tmp/sync-web-typecheck.log 2>&1; then
    echo "  ✗ Typecheck failed. See /tmp/sync-web-typecheck.log"
    tail -20 /tmp/sync-web-typecheck.log
    exit 1
  fi

  git add -A
  if git diff --cached --quiet; then
    echo "  → no changes"
  else
    git commit -m "sync: from monorepo $(date +%Y-%m-%dT%H:%M:%S)"
    git push origin main
    echo "  → pushed"
  fi

  cd - > /dev/null
  echo "  ✓ Web sync done"
}

case "$CMD" in
  api)  sync_api ;;
  web)  sync_web ;;
  both) sync_api; sync_web ;;
  *)    echo "Usage: $0 <api|web|both>"; exit 1 ;;
esac

echo ""
echo "════════════════════════════════════════"
echo " Done. Remember to trigger deploys on Render manually."
echo " (Per rule #4: no auto-deploy hooks)"
echo "════════════════════════════════════════"
