#!/usr/bin/env node
/**
 * Application startup file for shared hosting.
 *
 * Target environment: 1 CPU core, 2 GB RAM
 * Compatible with: cPanel Node.js Selector, Plesk, CloudLinux, Passenger
 *
 * Setup (run once before first start):
 *   npm install
 *   npm run build
 *
 * In your hosting panel, set "Application startup file" to: app.js
 */

"use strict";

const { createServer } = require("http");
const { parse } = require("url");
const path = require("path");
const next = require("next");

// --- Resource limits (1 CPU, 2 GB RAM) ------------------------------------

process.env.NODE_ENV = "production";

// Reserve ~512 MB for the OS, web server, and other processes.
if (!process.env.NODE_OPTIONS?.includes("max-old-space-size")) {
  process.env.NODE_OPTIONS = [
    process.env.NODE_OPTIONS,
    "--max-old-space-size=1536",
  ]
    .filter(Boolean)
    .join(" ");
}

// Single-core host: keep libuv thread pool small.
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || "2";

// Disable telemetry to reduce background work.
process.env.NEXT_TELEMETRY_DISABLED = "1";

// --- Server -----------------------------------------------------------------

const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOST || "0.0.0.0";
const appDir = __dirname;

const app = next({ dev: false, dir: appDir });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (error) {
        console.error("Request handler error:", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    });

    server.once("error", (error) => {
      console.error("Server failed to start:", error);
      process.exit(1);
    });

    server.listen(port, hostname, () => {
      console.log(`Next.js ready on http://${hostname}:${port}`);
      console.log(`Working directory: ${path.resolve(appDir)}`);
    });
  })
  .catch((error) => {
    console.error("Failed to prepare Next.js application:", error);
    process.exit(1);
  });
