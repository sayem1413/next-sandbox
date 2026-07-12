#!/usr/bin/env node
/**
 * Copies static assets into the Next.js standalone output so the bundle
 * is self-contained and ready to upload to shared hosting.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const standaloneDir = path.join(root, ".next", "standalone");
const staticSrc = path.join(root, ".next", "static");
const staticDest = path.join(standaloneDir, ".next", "static");
const publicSrc = path.join(root, "public");
const publicDest = path.join(standaloneDir, "public");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    return;
  }

  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function removeDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  fs.rmSync(dir, { recursive: true, force: true });
}

if (!fs.existsSync(standaloneDir)) {
  console.error("Standalone output not found. Run: npm run build");
  process.exit(1);
}

if (!fs.existsSync(staticSrc)) {
  console.error("Static assets not found. Run: npm run build");
  process.exit(1);
}

console.log("Preparing standalone bundle for shared hosting...");

removeDir(staticDest);
copyDir(staticSrc, staticDest);

if (fs.existsSync(publicSrc)) {
  removeDir(publicDest);
  copyDir(publicSrc, publicDest);
  console.log("Copied public/ into standalone bundle.");
}

console.log("Copied .next/static into standalone bundle.");
console.log("Standalone bundle is ready.");
