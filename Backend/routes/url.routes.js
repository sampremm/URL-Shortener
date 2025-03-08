import express from "express";
import { shortenUrl, redirectUrl,analyticsurl } from "../controller/urlController.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/shorten",protect, shortenUrl);
router.get("/:shortUrl",protect, redirectUrl);
router.get("/analytics/:shortUrl",protect, analyticsurl);

export default router;
