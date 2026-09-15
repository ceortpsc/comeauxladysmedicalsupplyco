#!/usr/bin/env bash
set -euo pipefail
: "${RENDER_SERVICE_ID:?RENDER_SERVICE_ID is required}"
: "${BASE_URL:?BASE_URL is required}"
node scripts/render/deploy-policy.mjs
if ! command -v render >/dev/null 2>&1; then
  echo "Render CLI is required. Install from https://render.com/docs/cli" >&2
  exit 4
fi
render deploys create "$RENDER_SERVICE_ID" --wait --confirm -o json
BASE_URL="$BASE_URL" node scripts/render/verify-runtime.mjs
echo "Render deployment and runtime verification complete."
