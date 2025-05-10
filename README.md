
# 🔗 URL Shortener

A full-stack **URL Shortener** application that allows users to shorten long URLs, monitor analytics, and manage their links through an intuitive interface. It includes authentication, redirection, click tracking, and user-specific dashboards.

---

## 📌 Features

### 🔒 Authentication
- Sign up, log in, and maintain sessions via JWT tokens (stored in HTTP-only cookies).

### ✂️ URL Shortening
- Generate unique, shortened URLs for any valid long URL.
- Option to create **custom short URLs**.

### 🔁 Redirection
- Accessing a short URL redirects to the original long URL.
- Tracks number of clicks and timestamp data.

### 📊 Analytics
- Logged-in users can view analytics like:
  - Total clicks per URL
  - Timestamp history
  - Most visited links

---

## 🛠️ Tech Stack

### Backend
- **Node.js**, **Express.js**
- **MongoDB**, **Mongoose**
- **JWT**, **Cookie-parser**, **CORS**
- **Rate Limiting** (`rate-limiter-flexible`)
- **Redis** (optional for caching and rate limiting)

### Frontend
- **React.js** with **Vite**
- **Axios** for API communication
- **TailwindCSS** for styling
- **React Router** for navigation
- **Private Routes** with authentication guard
- **Responsive Design**

---

## ⚙️ Setup Instructions

### 📦 Backend

1. Clone the repository and navigate to the backend folder:
   ```bash
   git clone https://github.com/sampremm/URL-Shortener.git
   cd URL-Shortener/backend
````

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

4. Start the server:

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
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. Run the React app:

   ```bash
   npm run dev
   ```

---

## 🔌 API Endpoints (Backend)

### Auth Routes

* `POST /url/auth/signup` – Register user
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

## 🔐 Middleware

* **Rate Limiting**: Protects API endpoints from abuse.
* **CORS**: Allows frontend on `http://localhost:5173` to access backend.
* **Cookie Parser**: Parses JWT from cookies.
* **Auth Middleware**: Validates and extracts user data from token.

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
    │   ├── hooks/
    │   └── App.jsx
    └── index.html
```

---

## 📜 License

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sam Prem Kumar Thalla**
🔗 [GitHub](https://github.com/sampremm) | 📷 [Photography](https://instagram.com/) *(if you'd like to include it)*

```

Would you like me to generate the frontend `README.md` separately as well with screenshots and GIF placeholders?
```
