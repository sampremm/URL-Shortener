# URL Shortener Backend

This is the backend for the **URL Shortener** application. It allows users to shorten long URLs and access the original URLs via a unique shortened link. The backend is built using **Node.js**, **Express.js**, and **MongoDB** to handle URL shortening, redirection, and user authentication.

The backend API is equipped with **rate limiting**, **CORS**, and **authentication** for secure access to the service.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies](#technologies)
- [Setup](#setup)
- [Endpoints](#endpoints)
- [Middleware](#middleware)
- [Environment Variables](#environment-variables)
- [License](#license)

## Project Overview

This project provides a RESTful API for shortening URLs and allowing users to manage their shortened URLs through authentication. It includes the following features:

- **URL Shortening**: Shorten long URLs and get a unique shortened version.
- **Redirection**: Redirect users to the original URL when they visit the shortened URL.
- **User Authentication**: Register and log in to manage shortened URLs.
- **Rate Limiting**: Prevent abuse with a rate limiter for requests.
- **CORS**: Configured for frontend communication with specific origins.

## Technologies

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for building APIs in Node.js.
- **MongoDB**: NoSQL database for storing original and shortened URLs.
- **Mongoose**: MongoDB ODM for managing data and interactions.
- **dotenv**: For managing environment variables securely.
- **cors**: To handle cross-origin requests between the backend and frontend.
- **cookie-parser**: For parsing cookies, especially for handling authentication tokens.
- **rate-limiter-flexible**: To protect the server from excessive requests.

## Setup

Follow these steps to set up the backend locally:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sampremm/URL-Shortener.git
   cd URL-Shortener/backend
   ```

2. **Install dependencies**:

   Run the following command to install the required dependencies:

   ```bash
   npm install
   ```

3. **Create a `.env` file**:

   Create a `.env` file in the root directory and add the necessary environment variables. Example:

   ```
   MONGO_URI=mongodb://localhost:27017/shortener
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```

   - `MONGO_URI`: Your MongoDB connection string (use your MongoDB Atlas URL or local instance).
   - `PORT`: The port your server will run on (default is `3000`).
   - `JWT_SECRET`: Secret key for signing JWT tokens (for authentication).

4. **Run the server**:

   Start the server by running:

   ```bash
   npm start
   ```

   The server will be running on [http://localhost:3000](http://localhost:3000).

## Endpoints

### `GET /`

**Description**: A simple route to check if the server is running.

**Response**:
```json
{
  "message": "Hello World"
}
```

### `POST /url/shorten`

**Description**: Shortens a given URL.

**Request Body**:
```json
{
  "originalUrl": "https://www.example.com"
}
```

**Response**:
```json
{
  "shortenedUrl": "http://localhost:3000/abc123"
}
```

### `GET /url/:shortenedUrl`

**Description**: Redirects to the original URL using the shortened URL.

**Response**:
- Redirects to the original URL.

### `POST /url/auth/signup`

**Description**: Registers a new user.

**Request Body**:
```json
{
  "username": "johnDoe",
  "email": "johndoe@example.com",
  "password": "securePassword"
}
```

**Response**:
```json
{
  "message": "User successfully registered"
}
```

### `POST /url/auth/login`

**Description**: Logs in an existing user and returns an authentication token.

**Request Body**:
```json
{
  "email": "johndoe@example.com",
  "password": "securePassword"
}
```

**Response**:
```json
{
  "message": "Login successful",
  "token": "jwt-token"
}
```

## Middleware

### Rate Limiter

The rate limiter middleware (`limiter`) is configured to limit the number of requests that can be made to the API in a given time frame, preventing abuse and overloading the server.

### CORS

CORS (Cross-Origin Resource Sharing) is configured to allow the frontend (on `http://localhost:5173`) to make requests to the backend.

### Cookie Parser

The `cookie-parser` middleware is used to parse cookies, especially for handling JWT tokens for authentication.

## Environment Variables

The following environment variables are required:

- `MONGO_URI`: MongoDB connection string (Example: `mongodb://localhost:27017/shortener`).
- `PORT`: Port for the server to run on (default is `3000`).
- `JWT_SECRET`: Secret key for signing JWT tokens.
  
Example `.env` file:

```
MONGO_URI=mongodb://localhost:27017/shortener
PORT=3000
JWT_SECRET=your_jwt_secret
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

This README provides:

- **Project Overview**: A brief explanation of the project.
- **Technologies**: A list of technologies used.
- **Setup**: Instructions for setting up the backend locally.
- **Endpoints**: Detailed description of the API routes.
- **Middleware**: Explanation of the middleware used (Rate Limiting, CORS, and Cookie Parsing).
- **Environment Variables**: A section for environment variables.
- **License**: Information about the project's license.

You can modify it further based on your needs! Let me know if you'd like any adjustments.