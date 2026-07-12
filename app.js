#!/usr/bin/env node
/**
 * Shared hosting startup file (1 CPU, 2 GB RAM).
 *
 * Hosting panel setting: Application startup file = app.js
 *
 * Requires a pre-built standalone bundle at .next/standalone/
 * Create it locally with: npm run build:hosting
 * Or upload the zip from: npm run pack:hosting
 */

"use strict";

const fs = require("fs");
const path = require("path");

// --- Resource limits (1 CPU, 2 GB RAM) ------------------------------------

process.env.NODE_ENV = "production";

if (!process.env.NODE_OPTIONS?.includes("max-old-space-size")) {
  process.env.NODE_OPTIONS = [
    process.env.NODE_OPTIONS,
    "--max-old-space-size=1536",
  ]
    .filter(Boolean)
    .join(" ");
}

process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || "2";
process.env.NEXT_TELEMETRY_DISABLED = "1";
process.env.HOSTNAME = process.env.HOST || "0.0.0.0";

// --- Standalone server ------------------------------------------------------

const appRoot = __dirname;
const standaloneDir = path.join(appRoot, ".next", "standalone");
const standaloneServer = path.join(standaloneDir, "server.js");

if (!fs.existsSync(standaloneServer)) {
  console.error("Missing production bundle: .next/standalone/server.js");
  console.error("Build locally, then upload the hosting package:");
  console.error("  npm run pack:hosting");
  process.exit(1);
}

process.chdir(standaloneDir);

console.log(`Starting Next.js standalone server from ${standaloneDir}`);
console.log(`Listening on port ${process.env.PORT || 3000}`);

require("./server.js");
