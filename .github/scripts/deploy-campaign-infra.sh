#!/usr/bin/env bash
set -euo pipefail

echo "Deploy campaign infra: starting"

# 1) Apply Supabase migrations if supabase CLI is available
if command -v supabase >/dev/null 2>&1; then
  echo "Supabase CLI found. Running migrations (if any)."
  # Prefer migrations deploy; fallback to db push if migrations command not supported
  if supabase --version >/dev/null 2>&1; then
    # Try migrations deploy (newer CLI)
    echo "Running: supabase migrations deploy"
    supabase migrations deploy || true
  else
    echo "Attempting: supabase db push"
    supabase db push || true
  fi
else
  echo "Supabase CLI not found. Skipping DB migrations. To enable, install Supabase CLI in the runner or add a step to install it."
fi

# 2) Deploy Trigger.dev tasks (best-effort)
if [ -n "${TRIGGER_DEV_API_KEY:-}" ]; then
  echo "TRIGGER_DEV_API_KEY present. Attempting Trigger.dev deploy via npx (if CLI available)."
  # Try npx @trigger.dev/cli (package name may differ by version). Run best-effort without failing the job if unavailable.
  if npx --no-install @trigger.dev/cli version >/dev/null 2>&1 || true; then
    echo "Running Trigger.dev deploy (npx @trigger.dev/cli deploy)"
    # Example invocation — adjust project flag or command to match your Trigger.dev setup
    npx @trigger.dev/cli deploy --apiKey "$TRIGGER_DEV_API_KEY" --project "$TRIGGER_DEV_PROJECT" || echo "Trigger.dev CLI deploy failed or not configured; skipping"
  else
    echo "Trigger.dev CLI not available via npx. Skipping Trigger.dev deploy."
  fi
else
  echo "TRIGGER_DEV_API_KEY not provided; skipping Trigger.dev deploy step."
fi

# 3) Scheduler suggestion: run a one-off enqueue via internal admin endpoint if available
# If you expose a secure admin endpoint to trigger scheduler (recommended), call it here
if [ -n "${SCHEDULE_TRIGGER_URL:-}" ]; then
  echo "Triggering scheduler via SCHEDULE_TRIGGER_URL"
  curl -sSf -X POST "$SCHEDULE_TRIGGER_URL" || echo "Scheduler trigger failed"
else
  echo "No SCHEDULE_TRIGGER_URL configured. If you want the workflow to trigger the scheduler, set SCHEDULE_TRIGGER_URL as a secret."
fi

echo "Deploy campaign infra: finished"
