# 🔗 URL Shortener

A full‑stack URL shortener built with Node/Express (backend) and React + Vite (frontend).  
Features: authenticated link creation, redirection, click tracking, Redis caching, and per‑link analytics (charts).

---

## Table of contents

- About
- Features
- Tech stack
- Local setup (backend / frontend)
- Environment variables
- API (backend)
- Frontend routes
- Implementation notes & troubleshooting
- Folder structure
- License

---

## About

This project lets users shorten long URLs and track clicks/analytics. Authentication uses JWT stored in HTTP‑only cookies (recommended). Redis is used for caching redirects and analytics for performance.

---

## Features

- Sign up / Login with JWT (HTTP‑only cookie)
- Shorten URLs (unique id via nanoid)
- Redirect via short URL (server side redirect)
- Click count tracking stored in MongoDB
- Analytics endpoint per short id (cached in Redis)
- Protected routes for user dashboard
- Frontend UI with copy / redirect buttons and analytics charts (Recharts)

---

## Tech stack

- Backend: Node.js, Express, Mongoose (MongoDB), Redis, JWT
- Frontend: React (Vite), Axios, TailwindCSS, Recharts, Framer Motion
- Dev tooling: nodemon, concurrently (optional)

---

## Local setup

Prerequisites: Node 18+, npm, MongoDB, Redis.

1. Clone repo
   ```bash
   git clone <repo-url>
   cd link
   ```

### Backend

1. Install
   ```bash
   cd Backend
   npm install
   ```
2. Create `.env` (see Environment variables below).
3. Start server
   ```bash
   npm run dev
   ```
   Backend runs on PORT (default `3000`).

### Frontend

1. Install
   ```bash
   cd frontend
   npm install
   ```
2. Create `.env` (see Environment variables below).
3. Start dev server
   ```bash
   npm run dev
   ```
   Frontend runs on Vite default (e.g. `http://localhost:5173`).

---

## Environment variables

Backend (`Backend/.env`)
- MONGO_URI=mongodb://localhost:27017/shortener
- PORT=3000
- JWT_SECRET=your_jwt_secret
- REDIS_URL=redis://localhost:6379 (if used)
- NODE_ENV=development

Frontend (`frontend/.env`)
- VITE_APP_API_URL=http://localhost:3000/url

Notes:
- Backend sets JWT cookie on authentication. Frontend must call axios with `{ withCredentials: true }` when logging in and when making protected requests to allow cookies to be sent.
- If you change base URL structure, update axiosInstance and VITE_APP_API_URL accordingly.

---

## API Endpoints

Base: `${VITE_APP_API_URL}` points to `http://localhost:3000/url` by default.

Auth
- POST `/url/auth/signup` — Register (returns success; cookie set on login)
- POST `/url/auth/login` — Login (sets HTTP‑only cookie `jwt`)
- POST `/url/auth/logout` — Logout (clears cookie)

URL Management
- POST `/url/shorten` — Create short URL (protected; expects `{ originalUrl }` in body)
  - Response: `{ message, shortUrl, originalUrl }` — shortUrl is the id (e.g. `cgZEzUVu`)
- GET `/url/:shortId` — Redirect to original URL (server does res.redirect)
- GET `/url/profile` — Get all URLs for logged in user (protected)
- GET `/url/analytics/:shortId` — Get analytics for a specific short id (cached in Redis)

Backend details:
- `shorten` saves to MongoDB and caches mapping in Redis.
- `redirect` checks Redis first, falls back to DB, increments clicks, and `res.redirect(originalUrl)`.
- `analytics` returns: `{ originalUrl, shortUrl, clicks, createdAt, ip, userAgent, referrer }` and caches result for 1 hour.

---

## Frontend routes

- `/` or `/shorten` — Shorten a URL (public / authenticated)
- `/login` — Login form
- `/signup` — Signup
- `/profile` — Profile / list of user links (protected)
- `/analytics/:id` — Analytics view for a specific short id (protected)

UI notes:
- After login, frontend should send `{ withCredentials: true }` so the HTTP‑only cookie is stored by the browser.
- For redirect testing in the browser use the actual redirect endpoint (e.g. `http://localhost:3000/url/<shortId>`). The frontend can open that URL directly (window.open or anchor tag).

---

## Implementation notes & troubleshooting

- If you see "Not authorized, no token": backend `protect` middleware checks `Authorization` header OR `req.cookies.jwt`. Ensure:
  - Login request includes `{ withCredentials: true }` so the backend can set the cookie.
  - Subsequent protected requests include `{ withCredentials: true }`.
  - CORS on backend must include `{ origin: 'http://localhost:5173', credentials: true }`.
- Redirects: axios requests will not cause a browser redirect. To follow a server redirect in the client, use `window.location.href = redirectUrl` or open the backend redirect endpoint in a new tab (anchor or window.open).
- Short URL format:
  - Backend returns only the short id (e.g. `shortUrl: "cgZEzUVu"`). Frontend composes the clickable URL as `${VITE_APP_API_URL}/url/${shortId}` (or `${window.location.origin}/${shortId}` depending on desired domain).
- Redis cache keys:
  - `originalUrl` → shortId (set on shorten)
  - `shortId` → originalUrl (set on first redirect)
  - `analytics:<shortId>` → JSON analytics (cached 1 hour)

---

## Quick debugging checklist

- Backend running? `http://localhost:3000` reachable.
- MongoDB and Redis running.
- `.env` values correct.
- Login request includes `withCredentials`.
- Inspect cookies in browser dev tools (Application → Cookies).
- Network tab for analytics/shorten requests — check responses and status codes.

---

## Folder structure

```
link/
├─ Backend/         # Express app, controllers, models, middleware
├─ frontend/        # React (Vite) app
└─ README.md
```

---

## License

MIT

---

