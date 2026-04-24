import express from "express";
import  router from "./routes/url.routes.js";
import connectDB from "./data/db.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import client, { connectRedis } from "./config/redis.js";
import rateLimit from "express-rate-limit";

dotenv.config();


const port = process.env.PORT || 3000;
const app = express();  
app.use(express.json());
connectDB();
connectRedis().catch(console.error);


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // set this in Railway: https://url-shortener-six-sandy.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello World");
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, 
  legacyHeaders: false, 
  message: { error: 'Too many requests, please try again later.' }
});

app.use("/api/urls", apiLimiter, router);
app.use("/url/auth",authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
