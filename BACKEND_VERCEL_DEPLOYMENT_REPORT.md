# Backend Vercel Deployment Readiness Report

**Project:** Portfolio (React + Vite + TypeScript frontend, Express backend)
**Frontend (already deployed):** https://portfolio-frontend-two-sage.vercel.app/
**Backend:** `backend/` (entry `backend/server.js`)
**Backend Vercel Root Directory:** `backend`
**Report type:** Read-only audit (no source code modified, nothing committed/pushed/deployed)
**Date:** 2026-11-07

> Secrets were not displayed during this audit. Values are described by type/scheme only.

---

## A. Current Project Deployment Status

| Item | Status |
|---|---|
| Frontend deployment | Live at https://portfolio-frontend-two-sage.vercel.app/ |
| Backend deployment | **Not ready** (never successfully configured; local-only DB) |
| Backend serverless entry | Present but **uncommitted** (`backend/api/index.js`) |
| Backend serverless fixes | Present but **uncommitted** (`server.js`, `vercel.json`, `package.json`) |
| `backend/vercel.json` | Correct modern config in working tree (not committed) |
| Backend database | **Local MongoDB** (`mongodb://localhost...`), unreachable from Vercel |
| Backend env vars in Vercel | Not verified / not set (local `.env` only) |
| Frontend API URL | `http://localhost:5000` (local only) - **wrong for production** |
| Frontend Google client ID | Configured locally and matches backend |
| Overall | **NOT READY FOR DEPLOYMENT** |

**Important:** The backend fixes from the previous step are still in the working tree and are **not committed**. Vercel deploys from Git, so they will not be present in a deployment until committed and pushed.

Current working tree:
```
 M backend/package.json
 M backend/server.js
 M backend/vercel.json
?? backend/api/
?? backend/test_gemini.js
?? test_gemini_api.mjs
?? test_server.ps1
```

---

## B. Backend Code Readiness

| Area | Verdict | Notes |
|---|---|---|
| Serverless entry `backend/api/index.js` | PASS | Re-exports the Express app (`module.exports = app`). |
| Express export in `server.js` | PASS | `module.exports = app` present. |
| `app.listen()` guard | PASS | Only runs when `require.main === module` (direct execution). Not started when imported by Vercel. |
| `backend/vercel.json` | PASS | Modern `rewrites` to `/api`; no `index.js`/`dist` references. |
| Node.js compatibility | PASS | Global `fetch` used; `engines.node >= 18.0.0`. |
| API routes | PASS | Standard Express routing; compatible once serverless entry is used. |
| JWT authentication | PASS (with config caveat) | `middleware/auth.js` verifies with `process.env.JWT_SECRET`. `routes/auth.js` has a dev fallback secret - must set a real secret in production. |
| Google OAuth | PASS (with config caveat) | `POST /api/auth/google` verifies Google ID token with `GOOGLE_CLIENT_ID`. Fails with 500 if unset. |
| MongoDB connection | PASS (code) / FAIL (config) | Code now caches connection and tolerates failure. The configured URI is **local MongoDB** so production cannot connect. |
| Gemini AI integration | PASS (with config caveat) | Uses REST via global `fetch`; requires `GEMINI_API_KEY`. Model default is inconsistent across files. |
| CORS | PASS (config needed) | Single allowed origin from `CLIENT_URL`; currently `localhost:3000`. |
| Error handling | PASS | Express error middleware present and returns JSON. |
| Middleware | PASS | `cors`, `express.json`, JWT middleware. |
| Localhost-only dependencies | PARTIAL | `MONGODB_URI` default and `CLIENT_URL` default point to localhost; overridable by env vars. |
| Automated tests | NONE | `backend/package.json` has no `test` script. |
| Unused code | Note | `backend/services/groqService.js` is not imported anywhere (dead file, not a blocker). |
| In-memory cache | Note | `backend/utils/cache.js` is per-instance only; not shared across serverless invocations (functional caveat, not a blocker). |

### API route inventory

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Health check used by frontend |
| POST | `/api/auth/google` | Public | Verify Google ID token, return JWT |
| GET | `/api/auth/me` | Bearer JWT | Return current user |
| GET | `/api/tasks` | Bearer JWT | List/search/filter tasks |
| GET | `/api/tasks/:id` | Bearer JWT | Get one task |
| POST | `/api/tasks` | Bearer JWT | Create task |
| PUT | `/api/tasks/:id` | Bearer JWT | Update task |
| PATCH | `/api/tasks/:id/complete` | Bearer JWT | Toggle completion |
| DELETE | `/api/tasks/:id` | Bearer JWT | Delete task |
| POST | `/api/tasks/:id/ai-insight` | Bearer JWT | Gemini AI insight |
| POST | `/api/tasks/generate-description` | Bearer JWT | Gemini description |

Note: `router.use(auth)` applies to all `/api/tasks/*`, so the `guestId` fallback in `scopeFor()` is currently unreachable. This is a behavior note, not a deployment blocker.

---

## C. MongoDB Compass Connection Analysis & Remote Database Requirements

### C.1 What MongoDB Compass is

MongoDB Compass is a **GUI client** for browsing MongoDB. It is **not** a database hosting provider. Being able to open your database in Compass does not mean it is reachable from the internet.

### C.2 Current configured database

| Question | Answer |
|---|---|
| Is the project configured for local MongoDB or Atlas? | **Local MongoDB.** `backend/.env` `MONGODB_URI` uses the `mongodb://` scheme with a loopback host (`localhost`/`127.0.0.1`). It has **no credentials** in the URI. |
| Is it an Atlas URI? | **No.** It is not a `mongodb+srv://` Atlas-style connection string. |
| Can a Vercel-hosted backend access it? | **No.** Vercel Functions run in the cloud and cannot reach a database bound to your local machine / loopback interface. |
| Is the DB already configured for remote access? | **No.** It is local-only, unauthenticated, and not internet-exposed. |

The code fallback in `server.js` also defaults to `mongodb://127.0.0.1:27017/portfolioDB`, which likewise cannot work on Vercel.

### C.3 Does the project need MongoDB Atlas?

Yes - for a realistic Vercel deployment you need a **publicly reachable MongoDB** with authentication. **MongoDB Atlas** (free M0 tier is sufficient) is the recommended and simplest option. Alternatives (self-hosted MongoDB with public IP, TLS, auth, and firewall rules) are possible but not recommended for this project.

There is **no existing remote MongoDB connection configured** in this project.

### C.4 Exact steps to make the database accessible from Vercel

1. **Create an Atlas account and cluster**
   - Go to `https://www.mongodb.com/atlas` and create a free **M0** cluster (pick a region close to your Vercel region).

2. **Create a database user**
   - Atlas > Database Access > Add New Database User.
   - Use password authentication. Store the password in a password manager. Do not paste it into chat or commit it.

3. **Allow network access from Vercel**
   - Atlas > Network Access > Add IP Address.
   - Because Vercel Functions use dynamic egress IPs on standard plans, add `0.0.0.0/0` ("allow access from anywhere") for the simplest setup.
   - Trade-off: `0.0.0.0/0` is broad. Security is still enforced by the DB user password + Atlas auth. For stricter isolation you would need enterprise static-egress options.
   - Do **not** rely on "localhost" being allowed.

4. **Get the connection string**
   - Atlas > cluster > Connect > Drivers > Node.js.
   - Copy the `mongodb+srv://...` URI.
   - Replace `<password>` with the DB user password and include the database name, e.g.
     `mongodb+srv://USER:PASSWORD@cluster.../portfolioDB?retryWrites=true&w=majority`
   - Keep `retryWrites=true` and a reasonable `w=majority`.

5. **Test it in Compass (optional)**
   - In Compass, create a new connection using the Atlas `mongodb+srv://` string to confirm connectivity. Compass remains only the client.

6. **Migrate existing local data (if needed)**
   - Local data is not automatically in Atlas.
   - Option A (CLI): `mongodump` from the local `mongodb://127.0.0.1:27017/portfolioDB`, then `mongorestore` to the Atlas URI.
   - Option B (Compass GUI): export each collection from the local connection and import into the Atlas connection.
   - Collections in this project: `users`, `tasks` (Mongoose models).

7. **Set the new URI in the right places (never commit it)**
   - Local development: `backend/.env` `MONGODB_URI` (optional, for local testing against Atlas).
   - Production: Vercel **backend project** > Settings > Environment Variables > `MONGODB_URI`.
   - `.env` is already gitignored; only `.env.example` is tracked.

8. **Redeploy the backend** so the new environment variable takes effect.

---

## D. Complete Environment Variable Checklist

### D.1 Backend Vercel project (`backend` Root Directory)

| Variable | Required | Source of value | Current local state | Production action |
|---|---|---|---|---|
| `MONGODB_URI` | **Required** | MongoDB Atlas connection string | Local `mongodb://` loopback, no auth | **Replace with Atlas `mongodb+srv://` URI** in Vercel env |
| `JWT_SECRET` | **Required** | Generate a strong random string (32+ bytes) | Set locally | Set a unique production secret in Vercel; keep it stable (changing it invalidates all tokens) |
| `GOOGLE_CLIENT_ID` | **Required for Google sign-in** | Google Cloud Console (OAuth 2.0 Client ID) | Set locally | Set same value in Vercel |
| `CLIENT_URL` | **Required** | Deployed frontend origin | `http://localhost:3000` | Set to `https://portfolio-frontend-two-sage.vercel.app` |
| `GEMINI_API_KEY` | **Required for AI features** | Google AI Studio | Set locally | Set in Vercel |
| `GEMINI_MODEL` | Optional (has defaults) | Model name, e.g. `gemini-3.5-flash` | `gemini-3.5-flash` | Set explicitly in Vercel to a valid model for your account |
| `PORT` | Not required | n/a | `5000` | Ignored by Vercel; do not set |
| `NODE_ENV` | Not required | Vercel sets `production` | Not set | No action |

### D.2 Frontend Vercel project (repository root)

| Variable | Required | Source of value | Current local state | Production action |
|---|---|---|---|---|
| `VITE_API_URL` | **Required** | Deployed backend URL, e.g. `https://<backend>.vercel.app` | `http://localhost:5000` | Set to the backend Vercel URL, then **redeploy frontend** (Vite inlines at build time) |
| `VITE_GOOGLE_CLIENT_ID` | **Required for Google sign-in** | Google Cloud Console (same client ID as backend) | Set (matches backend) | Set same value in Vercel |
| `VITE_EMAILJS_SERVICE_ID` | Required if contact form is used | EmailJS dashboard | Set | Set in Vercel |
| `VITE_EMAILJS_TEMPLATE_ID` | Required if contact form is used | EmailJS dashboard | Set | Set in Vercel |
| `VITE_EMAILJS_PUBLIC_KEY` | Required if contact form is used | EmailJS dashboard | Set | Set in Vercel |
| `VITE_GITHUB_TOKEN` | Optional | GitHub personal access token | Not set | Optional; **exposed in client bundle** - avoid unless needed |
| `VITE_CONTACT_EMAIL` | Optional | Fallback email address | Not set (code fallback exists) | Optional |

### D.3 Important notes on variables

- `VITE_*` variables are **compiled into the frontend bundle at build time**. Changing them requires a **new frontend deployment**.
- `VITE_GITHUB_TOKEN` is visible to anyone loading the site. Only use a minimal, read-only token if absolutely necessary.
- `GOOGLE_CLIENT_ID` is not a client secret, but it must match between backend and frontend. Local values currently **match**.
- `JWT_SECRET` and `MONGODB_URI` are true secrets. Set them in the Vercel dashboard, never in Git.
- Root `.env.example` does not list `VITE_GOOGLE_CLIENT_ID` or the Gemini variables (documentation gap only; `.env.example` is safe and does not block deployment).

---

## E. Vercel Backend Project Configuration

| Setting | Value |
|---|---|
| Project source | Same GitHub repo |
| **Root Directory** | `backend` |
| Framework Preset | Express (auto-detected) - or **Other** if detection misbehaves |
| Build Command | Leave empty/default (Vercel builds the serverless function; do not use `vite build`) |
| Output Directory | Leave empty |
| Install Command | `npm install` (default) |
| Node.js Version | **20.x** or **22.x** (must be >= 18) |
| Serverless entry | `backend/api/index.js` (committed) |
| Routing | `backend/vercel.json` rewrites `/(.*)` -> `/api`; Express still receives original paths |
| Environment variables | `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `CLIENT_URL`, `GEMINI_API_KEY`, `GEMINI_MODEL` |
| MongoDB network access | Atlas Network Access must allow Vercel (`0.0.0.0/0` recommended for standard plans) |

`backend/vercel.json` (committed target):
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/(.*)", "destination": "/api" }
  ]
}
```

Expected health check after deploy: `GET https://<backend>.vercel.app/api/health` -> `{"status":"ok"}`.

---

## F. Vercel Frontend Project Configuration

| Setting | Value |
|---|---|
| Project source | Same GitHub repo |
| **Root Directory** | Repository root (`./`) |
| Framework Preset | **Vite** |
| Build Command | `npm run build` (runs `vite build`) |
| Output Directory | `dist` |
| Install Command | `npm install` (default) |
| Node.js Version | **20.x** or **22.x** (>= 18) |
| Environment variables | `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` (optional: `VITE_GITHUB_TOKEN`, `VITE_CONTACT_EMAIL`) |

### Google OAuth console settings

- Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client (Web).
- **Authorized JavaScript origins** must include:
  - `https://portfolio-frontend-two-sage.vercel.app`
  - Any custom domain and Vercel preview domains you intend to use.
- No backend redirect URI is required for the Google Identity token flow (`POST /api/auth/google` verifies the ID token audience).

### CORS

- Backend `CLIENT_URL` must be exactly the frontend origin (`https://portfolio-frontend-two-sage.vercel.app`).
- Current code allows a **single** origin. If you need preview deployments too, code changes would be required (out of scope for this audit).

---

## G. Security Checklist

| Check | Result |
|---|---|
| Are secrets committed to Git? | **No.** Only `.env.example` files are tracked. |
| Is `backend/.env` tracked? | **No** (gitignored, present only locally). |
| Is root `.env` tracked? | **No** (gitignored, present only locally). |
| `.gitignore` coverage | Root `.gitignore` contains `.env*` and `!.env.example`; applies to `backend/.env` too. |
| Hardcoded secret scan (tracked files) | **None found** (no API keys, MongoDB URIs with credentials, private keys, or `sk-` tokens). |
| JWT fallback risk | `backend/routes/auth.js` falls back to a dev secret if `JWT_SECRET` is missing. **Set `JWT_SECRET` in production.** |
| API key leakage in logs | Gemini key is only logged as a boolean ("configured") and redacted in error messages. Safe. |
| CORS configuration | Restricted to a single configured origin (not wildcard). Must be updated for production. |
| Frontend-exposed variables | `VITE_GITHUB_TOKEN` (if ever set) is public in the bundle. Avoid or use a minimal read-only token. |
| Atlas network exposure | `0.0.0.0/0` is broad; rely on strong DB user credentials. Tighten if using static egress. |

**Do not paste any secrets into chat, tickets, or commits. Set them only via local `.env` (untracked) and the Vercel project dashboard.**

---

## H. Test Results

Executed during this audit (no source files modified):

| Check | Command | Result |
|---|---|---|
| Backend syntax - server | `node --check backend/server.js` | **PASS** |
| Backend syntax - serverless entry | `node --check backend/api/index.js` | **PASS** |
| Backend syntax - routes/auth | `node --check backend/routes/auth.js` | **PASS** |
| Backend syntax - routes/tasks | `node --check backend/routes/tasks.js` | **PASS** |
| Backend syntax - gemini service | `node --check backend/services/geminiService.js` | **PASS** |
| JSON validity | parse `backend/vercel.json`, `backend/package.json`, root `package.json` | **PASS** |
| Serverless import + health | load `backend/api`, `GET /api/health` | **PASS** -> `200 {"status":"ok"}` |
| Listener guard | import did not start the port listener | **PASS** |
| Frontend type-check | `npm run lint` (`tsc --noEmit`) | **PASS** (no errors) |
| Frontend production build | `npm run build` (`vite build`) | **PASS** (479 modules; `dist/` regenerated, gitignored) |
| Backend automated tests | `backend/package.json` has no `test` script | **NONE AVAILABLE** |
| Ad-hoc scripts | `test_gemini.js`, `test_server.ps1`, `test_gemini_api.mjs` | **Not run** (external Gemini API calls / fake JWT / writes log files; not a test suite) |

Environment used: Node `v24.16.0`, npm `11.13.0` (local). Vercel should run Node 20.x or 22.x.

---

## I. Exact Remaining Tasks (in order)

1. **Commit and push the backend fixes** (currently uncommitted):
   - `backend/api/index.js` (new)
   - `backend/server.js`
   - `backend/vercel.json`
   - `backend/package.json`
   - Review first, then commit/push (the user must approve; this audit did not commit).

2. **Create MongoDB Atlas** (or another internet-reachable MongoDB):
   - Create M0 cluster, DB user, and enable network access (`0.0.0.0/0` for Vercel).
   - Copy the `mongodb+srv://` connection string and add the `portfolioDB` database name.

3. **Migrate data (if needed)** from local MongoDB to Atlas using `mongodump`/`mongorestore` or Compass export/import.

4. **Configure the Vercel backend project**:
   - Root Directory: `backend`.
   - Add env vars: `MONGODB_URI` (Atlas), `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `CLIENT_URL=https://portfolio-frontend-two-sage.vercel.app`, `GEMINI_API_KEY`, `GEMINI_MODEL`.
   - Node 20.x/22.x.

5. **Deploy the backend** and verify `GET /api/health` returns `{"status":"ok"}`.

6. **Configure the Vercel frontend project**:
   - Root Directory: repo root; Framework: Vite; Build: `npm run build`; Output: `dist`.
   - Set `VITE_API_URL` to the deployed backend URL.
   - Set `VITE_GOOGLE_CLIENT_ID` to the same value as backend `GOOGLE_CLIENT_ID`.
   - Set EmailJS variables if the contact form is used.

7. **Update Google OAuth authorized JavaScript origins** to include `https://portfolio-frontend-two-sage.vercel.app`.

8. **Redeploy the frontend** so the new `VITE_API_URL` is baked into the build.

9. **Verify end-to-end**:
   - Frontend loads; health probe succeeds.
   - Google sign-in returns a JWT.
   - Authenticated task CRUD works against Atlas.
   - AI Insight / description generation works (valid `GEMINI_MODEL` and key).

---

## J. Final Status

# NOT READY FOR DEPLOYMENT

Hard blockers remaining:
1. **Database is local only** - `MONGODB_URI` points to loopback MongoDB and cannot be reached by Vercel. Provision MongoDB Atlas and update the URI.
2. **Backend fixes are uncommitted** - `api/index.js`, `server.js`, `vercel.json`, and `package.json` must be committed/pushed before Vercel can use them.
3. **Backend env vars not set in Vercel** - `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `CLIENT_URL`, `GEMINI_API_KEY`, `GEMINI_MODEL`.
4. **Frontend `VITE_API_URL` is localhost** - must point to the deployed backend and the frontend must be redeployed.
5. **Google OAuth origin** - production frontend domain must be authorized in Google Cloud Console.

Non-blocking caveats:
- No automated backend test suite.
- In-memory cache is per serverless instance.
- Gemini model default is inconsistent across files; set `GEMINI_MODEL` explicitly.
- MongoDB connection is fire-and-forget on cold start (mongoose buffers); acceptable but first request may be slower.
- `backend/services/groqService.js` is unused.

Once tasks 1-9 in Section I are completed, the project will be deployment-ready.
