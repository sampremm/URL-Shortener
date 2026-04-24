# SnapLink — Distributed URL Shortener SaaS

> **Live Demo**: [url-shortener-six-sandy.vercel.app](https://url-shortener-six-sandy.vercel.app)  
> **API**: [url-shortener-production-8a23.up.railway.app](https://url-shortener-production-8a23.up.railway.app)

A production-grade, minimalist URL shortener built as an entry-level SaaS product. Demonstrates a distributed backend architecture with cloud-hosted databases, a premium animated frontend, and full CI/CD deployment.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Guest Shortening** | No login required — links auto-expire in 24 hours |
| **Authenticated Shortening** | Registered users get 30-day persistent links |
| **Custom Aliases** | Define your own short URL slug (e.g. `/my-brand`) |
| **Click Analytics** | Per-link click tracking with bar-chart visualisation |
| **Dark / Light Mode** | System-aware with `localStorage` persistence |
| **Framer Motion UI** | Staggered page loads, hover effects, spring animations |
| **Responsive Design** | Mobile-first layout with hamburger nav |
| **Key Generation Service** | Dedicated MySQL microservice for collision-free IDs |
| **Redis Caching** | Sub-millisecond redirect lookups via Upstash |
| **NGINX Load Balancer** | Distributes traffic across 3 stateless Express replicas |
| **Graceful Fallback** | nanoid fallback when Key Service is temporarily unavailable |

---

## 🏗️ Architecture

```
Browser (Vercel)
      │
      ▼
  NGINX (Port 3000)   ◄── Load Balancer (round-robin)
      │
  ┌───┴──────────────────┐
  │                      │
Backend Pod 1   Backend Pod 2   Backend Pod 3
  (Express)      (Express)       (Express)
      │               │               │
      └───────┬────────────────┬──────┘
              │                │
    ┌──────────────┐   ┌───────────────┐
    │  Upstash     │   │  MongoDB      │
    │  Redis (TLS) │   │  Atlas        │
    └──────────────┘   └───────────────┘
              │
    ┌─────────────────┐
    │  Key Service    │
    │  (Express)      │
    │  Aiven MySQL    │
    └─────────────────┘
```

- **Frontend**: Vite + React, deployed on Vercel
- **Backend**: 3× Express replicas behind NGINX, deployed on Railway
- **Key Service**: Dedicated Express service with Aiven Cloud MySQL, deployed on Railway
- **MongoDB Atlas**: Cloud-sharded document store for URL mappings
- **Upstash Redis**: Serverless Redis (TLS) for high-speed caching
- **Aiven MySQL**: Cloud MySQL for pre-generated short key pool

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS (dark mode via `class` strategy)
- Framer Motion (animations)
- Recharts (analytics charts)
- Axios (HTTP client)

**Backend**
- Node.js + Express
- Mongoose (MongoDB ODM)
- JWT Authentication
- express-rate-limit (100 req / 15 min per IP)
- cookie-parser

**Infrastructure**
- Docker + Docker Compose
- NGINX (load balancer)
- Railway (backend hosting)
- Vercel (frontend hosting)
- MongoDB Atlas · Aiven MySQL · Upstash Redis

---

## 📦 Local Development

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### 1. Clone
```bash
git clone https://github.com/sampremm/URL-Shortener.git
cd URL-Shortener
```

### 2. Configure environment files

**`Backend/.env`**
```env
DATABASE_URL=<your MongoDB Atlas URI>
REDIS_URL=<your Upstash Redis URI (rediss://)>
JWT_SECRET=<random secret>
JWT_EXPIRES_IN=64h
PORT=3000
BASE_URL=http://localhost:3000
```

**`KeyService/.env`**
```env
MYSQL_HOST=<Aiven host>
MYSQL_USER=avnadmin
MYSQL_PASSWORD=<password>
MYSQL_DATABASE=defaultdb
MYSQL_PORT=<port>
PORT=4000
```

**`frontend/.env`**
```env
VITE_APP_API_URL=http://localhost:3000
VITE_APP_BASE_URL=http://localhost:3000
```

### 3. Start services
```bash
# Start all containers (NGINX, backend replicas, KeyService)
docker compose up -d --build

# Start frontend dev server
cd frontend && npm install && npm run dev
```

App runs at `http://localhost:5173`.

---

## 🚀 Production Deployment

### Backend (Railway)
Add these environment variables in the Railway service dashboard:

```env
DATABASE_URL=<MongoDB Atlas URI>
REDIS_URL=<Upstash URI>
JWT_SECRET=<secret>
JWT_EXPIRES_IN=64h
KEY_SERVICE_URL=<Railway internal URL for KeyService>
FRONTEND_URL=https://your-frontend.vercel.app
BASE_URL=https://your-backend.up.railway.app
```

### KeyService (Railway)
```env
MYSQL_HOST=<Aiven host>
MYSQL_USER=avnadmin
MYSQL_PASSWORD=<password>
MYSQL_DATABASE=defaultdb
MYSQL_PORT=<port>
```

### Frontend (Vercel)
```env
VITE_APP_API_URL=https://your-backend.up.railway.app
VITE_APP_BASE_URL=https://your-backend.up.railway.app
```

---

## 🧪 End-to-End Tests

```bash
node test-backend.js
```

Covers: Registration → Login → Shorten → Redirect → Analytics.

---

## 📚 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/url/auth/register` | ❌ | Register a new user |
| `POST` | `/url/auth/login` | ❌ | Login, returns JWT |
| `GET` | `/url/auth/profile` | ✅ | Get current user |
| `POST` | `/url/auth/logout` | ✅ | Clear session |
| `POST` | `/api/urls` | Optional | Shorten a URL |
| `GET` | `/api/urls/:shortCode` | ❌ | Redirect to original URL |
| `GET` | `/api/urls/analytics/:id` | ✅ | Get click analytics for user |

Swagger UI available at `/api-docs` when running locally.

---

## 📁 Project Structure

```
URL-Shortener/
├── Backend/              # Express API (3 replicas via Docker)
│   ├── config/          # Redis client
│   ├── controller/      # URL + Auth logic
│   ├── data/            # MongoDB connection
│   ├── middleware/       # JWT auth, optional auth
│   ├── model/           # Mongoose schemas
│   └── routes/          # Express routers
├── KeyService/           # Key Generation microservice (MySQL)
├── frontend/             # Vite + React SPA
│   └── src/
│       ├── api/         # Axios instance
│       ├── components/  # Navbar
│       ├── context/     # Auth + Theme providers
│       └── pages/       # Home, Login, Signup, Analytics, Shorten
├── nginx.conf            # NGINX load balancer config
├── docker-compose.yml    # Local orchestration
└── test-backend.js       # E2E test suite
```

---

## 📝 Resume Highlights

- Designed a **multi-service SaaS** with NGINX load balancing across 3 stateless Express replicas
- Integrated **MongoDB Atlas**, **Aiven MySQL**, and **Upstash Redis (TLS)** as cloud-managed data layer
- Built a **Key Generation Service** to ensure collision-free short IDs across distributed pods
- Implemented **graceful degradation** — URL shortening continues via `nanoid` fallback when Key Service is unavailable
- Shipped a premium **React/Tailwind/Framer Motion** frontend with dark mode, analytics dashboard, and responsive design
- Deployed full-stack to **Railway** (backend) and **Vercel** (frontend) with proper CORS and environment variable configuration

---

*Built with ❤️ — SnapLink*
