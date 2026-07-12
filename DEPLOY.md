# Shared Hosting Deployment Guide

Deploy this Next.js app on **shared hosting** with **1 CPU** and **2 GB RAM** (cPanel, Plesk, Hostinger, A2 Hosting, etc.).

Build on your computer, upload the pre-built package, then start with `app.js`.

---

## Why build locally?

Shared hosts with 2 GB RAM often run out of memory during `next build`. This project uses Next.js **standalone output** so the upload is small and the server only runs the production bundle — no TypeScript compiler or dev dependencies needed on the host.

---

## Quick deploy (3 steps)

### 1. Create the upload package (local machine)

```bash
npm install
npm run pack:hosting
```

This produces:

| Output | Description |
|--------|-------------|
| `hosting-upload/` | Folder ready to upload |
| `nextjs-todo-hosting.zip` | Same contents as a zip archive |

### 2. Upload to your host

Upload `nextjs-todo-hosting.zip` via **File Manager** or **FTP/SFTP**, then extract into your application root:

```
/home/username/yourdomain.com/
├── app.js                 ← startup file
├── startup.sh
├── .next/
│   └── standalone/        ← production server + minimal node_modules
├── .env.example
├── .htaccess.example
└── HOSTING-README.txt
```

### 3. Configure and start (cPanel)

1. Open **Setup Node.js App** (or **Node.js Selector**).
2. **Create application**:
   - **Node.js version:** 20.x (minimum 18.18)
   - **Application mode:** Production
   - **Application root:** path to extracted folder
   - **Application URL:** your domain
   - **Application startup file:** `app.js`
3. **Environment variables** (Add Variable in panel):

   ```
   NODE_ENV=production
   NODE_OPTIONS=--max-old-space-size=1536
   UV_THREADPOOL_SIZE=2
   NEXT_TELEMETRY_DISABLED=1
   ```

4. Click **Run NPM Install** — **skip this** if you uploaded the pre-built package (dependencies are already inside `.next/standalone/node_modules`).
5. Click **Restart** / **Start**.

Visit your domain — the todo app should be live.

---

## Plesk setup

1. **Domains** → your domain → **Node.js**.
2. Enable Node.js, set version **20.x**.
3. Set **Document root** to the upload folder.
4. Set **Application Startup File** to `app.js`.
5. Add the environment variables above.
6. Click **Restart App**.

---

## SSH start (optional)

If SSH is available and the panel is not used:

```bash
cd /path/to/your/app
chmod +x startup.sh
./startup.sh
```

Or directly:

```bash
node app.js
```

---

## Apache `.htaccess` (if needed)

Most Node.js panels configure the reverse proxy automatically. If your host requires manual setup, rename `.htaccess.example` to `.htaccess` and set the port to match your app.

---

## Resource tuning (1 CPU / 2 GB RAM)

These are applied automatically by `app.js`:

| Setting | Value | Purpose |
|---------|-------|---------|
| `NODE_OPTIONS` | `--max-old-space-size=1536` | 1.5 GB heap; ~512 MB left for OS |
| `UV_THREADPOOL_SIZE` | `2` | Limits threads on single-core CPU |
| `NEXT_TELEMETRY_DISABLED` | `1` | Disables background telemetry |

---

## Verify deployment

```bash
# Homepage
curl -I https://yourdomain.com

# API
curl https://yourdomain.com/api/todos
```

Expected API response:

```json
{
  "success": true,
  "data": [...]
}
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Missing production bundle` | Re-run `npm run pack:hosting` locally and re-upload |
| 502 Bad Gateway | Ensure Node app is running; check panel logs |
| App crashes on start | Confirm Node 18.18+; verify `NODE_OPTIONS` is set |
| Build fails on server | Do **not** build on server — use `pack:hosting` locally |
| Static assets 404 | Re-run `npm run build:hosting` — static files must be copied into standalone |
| Wrong port | Host sets `PORT` automatically; do not hardcode unless required |

---

## npm scripts reference

| Command | Where to run | Description |
|---------|--------------|-------------|
| `npm run build:hosting` | Local | Build + prepare standalone bundle |
| `npm run pack:hosting` | Local | Build + create `hosting-upload/` and zip |
| `npm run start:hosting` | Server | Start via `app.js` |
| `./startup.sh` | Server | Start with env vars pre-set |

---

## Updating the live app

1. Make code changes locally.
2. Run `npm run pack:hosting`.
3. Upload and extract over the old files (or replace `.next/standalone/` and `app.js`).
4. Restart the Node.js app in your hosting panel.

---

## Upload contents (what the server needs)

The server does **not** need:

- Source TypeScript files (`src/`)
- `devDependencies`
- Full project `node_modules` at the root

The standalone bundle at `.next/standalone/` includes everything required to run.
