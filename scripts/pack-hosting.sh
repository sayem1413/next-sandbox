#!/usr/bin/env bash
#
# Build locally and create a zip ready to upload to shared hosting.
# Recommended for 1 CPU / 2 GB RAM hosts — build on your machine, not the server.
#
# Usage:
#   chmod +x scripts/pack-hosting.sh
#   ./scripts/pack-hosting.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$ROOT/hosting-upload"
ARCHIVE="$ROOT/nextjs-todo-hosting.zip"

cd "$ROOT"

echo "==> Installing dependencies..."
npm ci

echo "==> Building production bundle..."
npm run build

echo "==> Preparing standalone assets..."
node scripts/prepare-hosting.js

echo "==> Creating upload folder..."
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR/.next"

cp app.js "$OUTPUT_DIR/"
cp startup.sh "$OUTPUT_DIR/"
cp .htaccess.example "$OUTPUT_DIR/"
cp .env.example "$OUTPUT_DIR/"
cp HOSTING-README.txt "$OUTPUT_DIR/"

chmod +x "$OUTPUT_DIR/startup.sh"

# Only the standalone server bundle is needed on the server (much smaller than full node_modules).
cp -r .next/standalone "$OUTPUT_DIR/.next/"

echo "==> Creating archive..."
rm -f "$ARCHIVE"
(
  cd "$OUTPUT_DIR"
  zip -rq "$ARCHIVE" .
)

echo ""
echo "Upload package ready:"
echo "  Folder: $OUTPUT_DIR"
echo "  Zip:    $ARCHIVE"
echo ""
echo "Upload the zip to your host, extract it into your app root, then follow HOSTING-README.txt"
