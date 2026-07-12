Next.js Todo Demo — Shared Hosting Quick Start
===========================================

Target server: 1 CPU, 2 GB RAM
Node.js required: 18.18+ (20 LTS recommended)

STEP 1 — Build the upload package (on your computer)
----------------------------------------------------
  npm install
  npm run pack:hosting

This creates:
  hosting-upload/          ← folder to upload
  nextjs-todo-hosting.zip  ← or upload this zip and extract on the server


STEP 2 — Upload to your host
----------------------------
Upload and extract into your application root, e.g.:
  /home/username/yourdomain.com/
  /home/username/nodeapps/todo/

The folder must contain:
  app.js
  startup.sh
  .next/standalone/
  .env.example
  .htaccess.example


STEP 3 — Configure Node.js in hosting panel (cPanel example)
------------------------------------------------------------
1. Open "Setup Node.js App" / "Node.js Selector"
2. Create application:
   - Node.js version: 20.x
   - Application mode: Production
   - Application root: your upload folder
   - Application URL: your domain or subdomain
   - Application startup file: app.js
3. Add environment variables (from .env.example):
   NODE_ENV=production
   NODE_OPTIONS=--max-old-space-size=1536
   UV_THREADPOOL_SIZE=2
   NEXT_TELEMETRY_DISABLED=1
4. Save and click "Restart" / "Start"


STEP 4 — Verify
---------------
Open your domain in a browser. The todo app should load.
API test:
  curl https://yourdomain.com/api/todos


SSH alternative (if available)
------------------------------
  cd /path/to/your/app
  chmod +x startup.sh
  ./startup.sh


Troubleshooting
---------------
- "Missing production bundle" → re-run npm run pack:hosting locally and re-upload
- 502 / app not reachable → check Node app is running and PORT matches proxy
- Out of memory → confirm NODE_OPTIONS=--max-old-space-size=1536 is set
- Build fails on server → always build locally; do not run npm run build on 2 GB hosts

For full details see DEPLOY.md in the repository.
