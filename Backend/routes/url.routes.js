import express from "express";
import { shortenUrl, redirectUrl, getAnalytics } from "../controller/urlController.controller.js";
import { protect, protectOptional } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", protectOptional, shortenUrl);
router.get("/analytics/:id",protect, getAnalytics);

export default router;
