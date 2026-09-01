# Rudra Prajapati — Portfolio

Personal portfolio built with **React 19**, **Vite**, **Tailwind CSS v4**, and a dark,
glassmorphism design system with mouse-scrubbed background video, custom cursor,
scroll-animated sections, and responsive layout.

## Structure

```text
├── frontend (this root)
│   ├── src/
│   │   ├── components/     # Navbar, Hero, sections, effects
│   │   ├── constants/      # portfolioData.ts — central content
│   │   ├── context/        # AuthContext, ToastContext
│   │   ├── hooks/          # useScrollSpy, useTypewriter
│   │   └── services/       # github, task, auth, contact service layers
│   └── public/
└── backend/                # Express + MongoDB (auth, tasks)
    ├── routes/
    ├── models/
    ├── middleware/
    └── server.js
```

## Run Locally (frontend)

1. `npm install`
2. Copy `.env.example` to `.env` and fill in real values (optional for local dev).
3. `npm run dev` — serves on http://localhost:3000

## Run Backend (optional but required for Sign In / Create Account)

Sign In and Create Account need the backend + MongoDB running. Run both in one
command from the project root:

```bash
npm run dev:all   # starts frontend (3000) + backend (5000) together
```

Or run them separately:

```bash
npm run dev:frontend   # terminal 1
npm run dev:backend    # terminal 2 (requires MongoDB on 27017)
```

Set backend secrets in `backend/.env` (copy from `backend/.env.example`) —
`MONGODB_URI` and `JWT_SECRET` at minimum. Never commit real secrets.

> Note: `npm run dev` alone starts only the frontend, so Sign In / Create
> Account will report "Unable to connect to the server" — use `dev:all` (or start
> the backend) for full authentication.

## Build

```bash
npm run build   # frontend production build
npm run lint    # tsc --noEmit type check
```
