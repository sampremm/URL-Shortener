import express from "express";
import { shortenUrl, redirectUrl, getAnalytics } from "../controller/urlController.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/shorten",protect, shortenUrl);
router.get("/analytics/:id",protect, getAnalytics);
router.get('/:shortCode',protect, redirectUrl);
export default router;
