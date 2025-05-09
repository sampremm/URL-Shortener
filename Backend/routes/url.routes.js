import express from "express";
import { shortenUrl, redirectUrl,analyticsurl, } from "../controller/urlController.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/shorten",protect, shortenUrl);
router.get("/analytics/:shortUrl",protect, analyticsurl);
router.get('/:shortCode',protect, redirectUrl);
export default router;
