# Deployment Guide

This covers three things, in order:
1. Uploading the project to GitHub from VS Code
2. Deploying the backend (Render)
3. Deploying the frontend (Vercel)

---

## Part 1 — Upload to GitHub from VS Code

### 1.1 Open the project in VS Code
- `File → Open Folder…` → select the `algo-trade-platform` folder.

### 1.2 Make sure Git is installed
Open a VS Code terminal (`` Ctrl+` ``  /  `` Cmd+` ``) and run:
```bash
git --version
```
If it's not installed, download it from https://git-scm.com/downloads first.

### 1.3 Initialize the repository
In the VS Code terminal, at the project root:
```bash
git init
git add .
git commit -m "Initial commit: Vantage Quant algo trading platform"
```
The included `.gitignore` already excludes `node_modules/`, `.env` files,
and local build output — double-check `git status` before committing to
make sure no `.env` file is staged.

### 1.4 Create the GitHub repository
**Option A — GitHub website**
1. Go to https://github.com/new
2. Name it (e.g. `vantage-quant`), leave it **empty** (no README/license —
   you already have one), click **Create repository**.
3. Copy the remote URL it shows you, e.g.
   `https://github.com/<your-username>/vantage-quant.git`

**Option B — GitHub CLI (if installed)**
```bash
gh repo create vantage-quant --private --source=. --remote=origin
```

### 1.5 Connect and push from VS Code terminal
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/vantage-quant.git
git push -u origin main
```
You'll be prompted to sign in to GitHub the first time (VS Code or the
browser will open an auth flow). After that, every future change is:
```bash
git add .
git commit -m "describe your change"
git push
```

### 1.6 (Optional) Use VS Code's built-in Git UI instead of the terminal
- Click the **Source Control** icon in the left sidebar (or `Ctrl+Shift+G`).
- Stage changes with the `+` icon, type a commit message, click ✓ **Commit**.
- Click **Publish Branch** the first time to push and create the GitHub repo
  directly from the UI (it will prompt you to sign in to GitHub).

---

## Part 2 — Deploy the backend (Render)

Render works well because it has a writable disk for the JSON data store and
no cold-start issues with OAuth callbacks. Railway works almost identically
if you prefer it.

1. Go to https://render.com → sign up/log in → **New → Web Service**.
2. Connect your GitHub account and select the `vantage-quant` repo.
3. Configure:
   - **Root directory:** `server`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Instance type:** Free or Starter is fine to begin.
4. Add environment variables (Render dashboard → **Environment**), copying
   from `server/.env.example`:
   ```
   PORT=10000
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-domain.vercel.app
   JWT_SECRET=<generate a long random string>
   COOKIE_SECRET=<generate another long random string>
   KITE_API_KEY=...
   KITE_API_SECRET=...
   KITE_REDIRECT_URL=https://your-backend.onrender.com/api/broker/kite/callback
   UPSTOX_API_KEY=...
   UPSTOX_API_SECRET=...
   UPSTOX_REDIRECT_URL=https://your-backend.onrender.com/api/broker/upstox/callback
   DB_PATH=./data/algotrade.db
   ```
   (Render sets `PORT` itself in most plans — check the dashboard value and
   match it, or just read `process.env.PORT` as this app already does.)
5. **Add a persistent disk** (Render → your service → **Disks**) mounted at
   `/opt/render/project/src/server/data` if you want the JSON data store to
   survive deploys. Free tier disks are ephemeral — for real production use
   with multiple users, migrate to Postgres (see note at the bottom).
6. Click **Create Web Service**. Note the live URL, e.g.
   `https://vantage-quant-api.onrender.com`.
7. **Update your Kite Connect / Upstox app's redirect URL** in their
   respective developer dashboards to match the production
   `KITE_REDIRECT_URL` / `UPSTOX_REDIRECT_URL` above.

---

## Part 3 — Deploy the frontend (Vercel)

1. Go to https://vercel.com → sign up/log in with GitHub → **Add New →
   Project** → import the `vantage-quant` repo.
2. Configure:
   - **Root directory:** `client`
   - **Framework preset:** Vite (auto-detected)
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
3. Add an environment variable so the frontend knows where the API lives —
   **but note:** this template's `client/src/services/api.js` currently
   calls a relative `/api` path, which relies on the Vite dev proxy locally.
   For production, do one of:
   - **(A) Simplest)** Point your frontend domain's `/api/*` requests to the
     backend using Vercel rewrites — create `client/vercel.json`:
     ```json
     {
       "rewrites": [
         { "source": "/api/:path*", "destination": "https://your-backend.onrender.com/api/:path*" }
       ]
     }
     ```
   - **(B)** Change `client/src/services/api.js` to use an absolute URL via
     `import.meta.env.VITE_API_URL`, and set `VITE_API_URL` in Vercel's
     environment variables to your Render backend URL.
4. Click **Deploy**. Note the live URL, e.g. `https://vantage-quant.vercel.app`.
5. Go back to Render and update `CLIENT_URL` to this exact URL (used for
   CORS and OAuth redirects back to the dashboard).

---

## Post-deploy checklist

- [ ] Visit the live frontend URL — landing page and sample backtest load.
- [ ] Sign up for an account, confirm you land on `/dashboard`.
- [ ] Click **Connect** next to Zerodha Kite / Upstox, confirm the OAuth
      redirect round-trips back to your dashboard successfully.
- [ ] Confirm `server/.env` (or Render's environment tab) has no leftover
      placeholder values like `your_kite_api_key`.
- [ ] Confirm `.env` files were never committed to GitHub (`git log -p -- '*.env'`
      should show nothing).

## Scaling beyond the JSON file store

The bundled `server/src/db/database.js` is a flat JSON file — perfect for a
demo or single small deployment, but not safe for concurrent writes at
scale or for platforms with ephemeral disks. When you're ready for real
multi-user production:
1. Stand up a managed Postgres instance (Render, Railway, Supabase, or
   Neon all have free tiers).
2. Replace the collection functions in `database.js` with equivalent
   queries using `pg` or an ORM like Prisma — the rest of the app (
   controllers/services) only calls `.insert()` / `.find()` / `.findOne()`,
   so you can keep the same function signatures and swap the
   implementation underneath.
