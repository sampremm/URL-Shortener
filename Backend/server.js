import express from "express";
import  router from "./routes/url.routes.js";
import connectDB from "./data/db.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectRedis from "./config/redis.js";


dotenv.config();
connectRedis();

const port = process.env.PORT || 3000;
const app = express();  
app.use(express.json());
connectDB();


app.use(cors(
  {
    origin: "http://localhost:5173", // Allow frontend origin (React)
    credentials: true
  }
));

app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/url",router);
app.use("/url/auth",authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
