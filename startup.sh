#!/usr/bin/env bash
#
# Start the app on shared hosting (after upload).
# Build is NOT run here — upload a pre-built package instead.
#
# Usage:
#   chmod +x startup.sh
#   ./startup.sh
#
set -euo pipefail

cd "$(dirname "$0")"

export NODE_ENV=production
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1536}"
export UV_THREADPOOL_SIZE="${UV_THREADPOOL_SIZE:-2}"
export NEXT_TELEMETRY_DISABLED=1

if [[ ! -f ".next/standalone/server.js" ]]; then
  echo "Error: .next/standalone/server.js not found."
  echo "Upload a pre-built package created with: npm run pack:hosting"
  exit 1
fi

echo "Starting application..."
exec node app.js
