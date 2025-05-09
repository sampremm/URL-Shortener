import { nanoid } from "nanoid";
import Url from "../model/url.js";
import client from "../config/redisClient.js"; 

export const shortenUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({ error: "Original URL is required" });
        }

        // Check if the URL already exists in Redis
        let shortUrl = await client.get(originalUrl);
        if (shortUrl) {
            return res.status(200).json({
                message: "Short URL retrieved from cache",
                shortUrl,
                originalUrl,
            });
        }

        // Check if the URL already exists in the database
        let url = await Url.findOne({ originalUrl });
        if (url) {
            // Cache the short URL in Redis
            await client.set(originalUrl, url.shortUrl);
            return res.status(200).json({
                message: "Short URL already exists",
                shortUrl: url.shortUrl,
                originalUrl: url.originalUrl,
            });
        }

        // Generate a unique short URL
        shortUrl = nanoid(8);

        // Save the new URL to the database
        url = new Url({ originalUrl, shortUrl });
        await url.save();

        // Cache the new short URL in Redis
        await client.set(shortUrl, originalUrl); 


        res.status(201).json({
            message: "Short URL created successfully",
            shortUrl,
            originalUrl,
        });
    } catch (error) {
        console.error("Error in shortenUrl:", error.message);
        res.status(500).json({ error: "Server error", message: error.message });
    }
};

export const redirectUrl = async (req, res) => {
    const { shortCode } = req.params;

    try {
        // Check Redis first for the original URL
        let originalUrl = await client.get(shortCode);
        console.log("From Redis:", originalUrl);

        if (!originalUrl) {
            // If not found in Redis, fetch from MongoDB
            const urlDoc = await Url.findOne({ shortUrl: shortCode });
            console.log("From MongoDB:", urlDoc);
            console.log("Short code received:", shortCode);
            if (!urlDoc) {
                return res.status(404).json({ error: "Short URL not found" });
            }


            originalUrl = urlDoc.originalUrl;

            // Cache the original URL in Redis
            await client.set(shortCode, originalUrl);
        }

        // Increment the click count in MongoDB
        await Url.updateOne({ shortUrl: shortCode }, { $inc: { clicks: 1 } });

        // Redirect to the original URL
        return res.redirect(originalUrl);
        
    } catch (err) {
        console.error("Redirect Error:", err.message);
        res.status(500).json({ error: "Server error", message: err.message });
    }
};

export const analyticsurl = async (req, res) => {
    const { shortUrl } = req.params;

    if (!shortUrl || shortUrl.length !== 8) {
        return res.status(400).json({ error: "Invalid short URL" });
    }

    try {
        // Check Redis for analytics data
        const cachedAnalytics = await client.get(`analytics:${shortUrl}`);
        if (cachedAnalytics) {
            return res.status(200).json(JSON.parse(cachedAnalytics));
        }

        // Find the URL document in the database
        const url = await Url.findOne({ shortUrl });

        if (!url) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        // Prepare analytics data
        const analyticsData = {
            originalUrl: url.originalUrl,
            shortUrl: url.shortUrl,
            clicks: url.clicks,
            createdAt: url.createdAt,
        };

        // Cache analytics data in Redis
        await client.set(`analytics:${shortUrl}`, JSON.stringify(analyticsData), "EX", 3600); // Cache for 1 hour

        res.status(200).json(analyticsData);
    } catch (error) {
        console.error("Error in analyticsurl:", error.message);
        res.status(500).json({ error: "Server error", message: error.message });
    }
};

