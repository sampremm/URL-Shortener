import { nanoid } from 'nanoid';
import Url from '../model/url.js';
import client from '../config/redisClient.js';
import mongoose from 'mongoose';


export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const userId = req.user._id;

    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    let shortUrl = await client.get(originalUrl);
    if (shortUrl) {
      return res.status(200).json({
        message: 'Short URL retrieved from cache',
        shortUrl,
        originalUrl,
      });
    }

    let url = await Url.findOne({ originalUrl, userId });
    if (url) {
      await client.set(originalUrl, url.shortUrl, 'EX', 3600);
      return res.status(200).json({
        message: 'Short URL already exists',
        shortUrl: url.shortUrl,
        originalUrl: url.originalUrl,
      });
    }

    shortUrl = nanoid(8);
    url = new Url({ originalUrl, shortUrl, userId });
    await url.save();

    await client.set(originalUrl, shortUrl, 'EX', 3600);

    res.status(201).json({
      message: 'Short URL created successfully',
      shortUrl,
      originalUrl,
    });
  } catch (error) {
    console.error('Error in shortenUrl:', error.message);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const redirectUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    let originalUrl = await client.get(shortCode);
    console.log('From Redis:', originalUrl);

    if (!originalUrl) {
      const urlDoc = await Url.findOne({ shortUrl: shortCode });
      console.log('From MongoDB:', urlDoc);
      if (!urlDoc) {
        return res.status(404).json({ error: 'Short URL not found' });
      }

      originalUrl = urlDoc.originalUrl;
      await client.set(shortCode, originalUrl, 'EX', 3600);
    }

    await Url.updateOne({ shortUrl: shortCode }, { $inc: { clicks: 1 } });
    return res.redirect(originalUrl);
  } catch (err) {
    console.error('Redirect Error:', err.message);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

export const getAnalytics = async (req, res) => {
  const { id } = req.params;
  console.log(`getAnalytics called for userId: ${id}`);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const urls = await Url.find({ userId: id });
    console.log(`Found ${urls.length} URLs for userId: ${id}`);

    const analyticsList = await Promise.all(
      urls.map(async (url) => {
        const cacheKey = `analytics:${url.shortUrl}`;
        const cached = await client.get(cacheKey);
        if (cached) {
          console.log(`Cache hit for ${url.shortUrl}`);
          return JSON.parse(cached);
        }

        const data = {
          _id: url._id,
          originalUrl: url.originalUrl,
          shortUrl: url.shortUrl,
          clicks: url.clicks,
          createdAt: url.createdAt,
        };

        await client.set(cacheKey, JSON.stringify(data), 'EX', 3600);
        console.log(`Cache set for ${url.shortUrl}`);
        return data;
      })
    );

    res.status(200).json(analyticsList);
  } catch (err) {
    console.error('Error fetching user analytics:', err.message);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};