import express from "express";
import { registeruser, loginuser, profileuser } from "../controller/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import cookieParser from "cookie-parser";
const router = express.Router();
router.use(cookieParser());

router.post("/register", registeruser);
router.post("/login", loginuser);
router.get("/profile", protect, profileuser); // Protected Route

export default router;
