#!/usr/bin/env bash
#
# Shared hosting deploy + start script (1 CPU, 2 GB RAM).
# Run from the application root after uploading files.
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

echo "Installing dependencies..."
npm ci --omit=dev 2>/dev/null || npm install --omit=dev

echo "Building application..."
npm run build

echo "Starting application..."
exec node app.js
