
# 🔗 URL Shortener

A full-stack **URL Shortener** application that allows users to shorten long URLs, track analytics, and manage their links via an intuitive dashboard. Features include authentication, custom short URLs, redirection, click tracking, and visual analytics.

---

## 📌 Features

### 🔒 Authentication

* Sign up, log in, and maintain sessions using JWT tokens (stored in HTTP-only cookies).
* Secure user dashboard and analytics access.

### ✂️ URL Shortening

* Generate unique, shortened URLs for any valid long URL.
* Option to create **custom short URLs**.

### 🔁 Redirection

* Accessing a short URL automatically redirects to the original URL.
* Tracks number of clicks, timestamp history, and user activity.

### 📊 Analytics

* Logged-in users can view analytics like:

  * Total clicks per URL
  * Click distribution charts (Bar & Pie)
  * Timestamp history of clicks
  * Most visited links

---

## 🛠️ Tech Stack

### Backend

* **Node.js**, **Express.js**
* **MongoDB**, **Mongoose**
* **JWT** for authentication
* **Cookie-parser**, **CORS**
* **Rate Limiting** (`rate-limiter-flexible`)
* **Redis** (optional for caching and rate limiting)

### Frontend

* **React.js** (Vite)
* **Axios** for API communication
* **TailwindCSS** for styling
* **React Router v6** for navigation
* **Recharts** for visual analytics
* **Private Routes** for auth-guarded pages
* Responsive design for mobile & desktop

---

## ⚙️ Setup Instructions

### 📦 Backend

1. Clone the repository and navigate to the backend folder:

```bash
git clone https://github.com/sampremm/URL-Shortener.git
cd URL-Shortener/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```
MONGO_URI=mongodb://localhost:27017/shortener
PORT=3000
JWT_SECRET=your_jwt_secret
```

4. Start the backend server:

```bash
npm start
```

### 🌐 Frontend

1. Navigate to the frontend folder:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```
VITE_APP_API_URL=http://localhost:3000
```

4. Run the React app:

```bash
npm run dev
```

5. Open the app in your browser at `http://localhost:5173`.

---

## 🔌 API Endpoints (Backend)

### Auth Routes

* `POST /url/auth/signup` – Register a new user
* `POST /url/auth/login` – Login and receive JWT
* `POST /url/auth/logout` – Clear auth token

### URL Management

* `POST /url/shorten` – Shorten a new URL (auth required)
* `GET /url/:shortId` – Redirect to original URL
* `GET /url/profile` – Get all shortened URLs for logged-in user
* `GET /url/analytics/:shortId` – View analytics for a specific URL

---

## 🧩 Frontend Routes

| Path             | Description                   | Auth Required |
| ---------------- | ----------------------------- | ------------- |
| `/`              | Home / Shorten a URL          | ✅             |
| `/login`         | Login page                    | ❌             |
| `/signup`        | Sign up page                  | ❌             |
| `/profile`       | View your links & analytics   | ✅             |
| `/analytics/:id` | View analytics of a short URL | ✅             |

---

## 📊 Analytics with Charts

* **Bar Chart:** Clicks per URL
* **Pie Chart:** Click distribution among links
* **List View:** Original URL, Short URL, Click count, Created date

> Implemented using **Recharts**: `BarChart`, `PieChart`, `Tooltip`, and `ResponsiveContainer`.

---

## 📁 Folder Structure

```
URL-Shortener/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── hooks/
    │   └── App.jsx
    └── index.html
```

---

## 🔐 Middleware

* **Rate Limiting:** Protects endpoints from abuse.
* **CORS:** Allows frontend to access backend.
* **Cookie Parser:** Parses JWT from cookies.
* **Auth Middleware:** Validates user tokens and protects routes.

