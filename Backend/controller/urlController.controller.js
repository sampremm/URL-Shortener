import { nanoid } from 'nanoid';
import Url from '../model/url.js';
import client from '../config/redis.js';
import mongoose from 'mongoose';


export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customURL } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    try {
      new URL(originalUrl);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    if (customURL) {
      if (customURL.length < 3 || customURL.length > 20) {
        return res.status(400).json({ error: 'Custom URL must be between 3 and 20 characters' });
      }
      if (!/^[a-zA-Z0-9-_]+$/.test(customURL)) {
        return res.status(400).json({ error: 'Custom URL can only contain alphanumeric characters, hyphens, and underscores' });
      }
      const existingCustom = await Url.findOne({ shortUrl: customURL });
      if (existingCustom) {
        return res.status(409).json({ error: 'Custom URL already taken' });
      }
    }

    let shortUrl = null;
    let isCustom = false;
    let expiresAt = null;

    if (!userId) {
      // If anonymous, default to 24 hour expiration
      expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
    } else {
      // If logged in, default to 30 days expiration
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
    }

    // Only do originalUrl reverse lookup if it's NOT a custom URL request
    if (!customURL) {
      let cachedShortUrl = await client.get(`long:${originalUrl}`);
      if (cachedShortUrl) {
        return res.status(200).json({
          message: 'Short URL retrieved from cache',
          shortUrl: cachedShortUrl,
          originalUrl,
        });
      }

      let url = await Url.findOne({ originalUrl, userId, isCustom: false });
      if (url) {
        await client.set(`long:${originalUrl}`, url.shortUrl, 'EX', 86400);
        return res.status(200).json({
          message: 'Short URL already exists',
          shortUrl: url.shortUrl,
          originalUrl: url.originalUrl,
        });
      }
      try {
        const keyServiceUrl = process.env.KEY_SERVICE_URL || 'http://localhost:4000';
        const keyRes = await fetch(`${keyServiceUrl}/api/keys`, {
          signal: AbortSignal.timeout(3000),
        });
        if (keyRes.ok) {
          const keyData = await keyRes.json();
          shortUrl = keyData.key;
        } else {
          console.warn('KeyService returned non-OK, falling back to nanoid');
          shortUrl = nanoid(7);
        }
      } catch (keyErr) {
        console.warn('KeyService unreachable, falling back to nanoid:', keyErr.message);
        shortUrl = nanoid(7);
      }
    } else {
      shortUrl = customURL;
      isCustom = true;
    }

    const url = new Url({ originalUrl, shortUrl, userId, isCustom, expiresAt });
    await url.save();

    const cacheValue = JSON.stringify({ originalUrl, expiresAt });
    await client.set(`short:${shortUrl}`, cacheValue, 'EX', 86400);
    if (!isCustom) {
      await client.set(`long:${originalUrl}`, shortUrl, 'EX', 86400);
    }

    res.status(201).json({
      message: 'Short URL created successfully',
      shortUrl,
      originalUrl,
      expiresAt
    });
  } catch (error) {
    console.error('Error in shortenUrl:', error.message);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const redirectUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    let originalUrl = null;
    let expiresAt = null;
    
    let cachedData = await client.get(`short:${shortCode}`);

    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      originalUrl = parsed.originalUrl;
      expiresAt = parsed.expiresAt ? new Date(parsed.expiresAt) : null;
    } else {
      const urlDoc = await Url.findOne({ shortUrl: shortCode });
      if (!urlDoc) {
        return res.status(404).json({ error: 'Short URL not found' });
      }
      originalUrl = urlDoc.originalUrl;
      expiresAt = urlDoc.expiresAt;
      
      const cacheValue = JSON.stringify({ originalUrl, expiresAt });
      await client.set(`short:${shortCode}`, cacheValue, 'EX', 86400);
    }

    if (expiresAt && expiresAt < new Date()) {
      return res.status(410).send('This link has expired');
    }

    await Url.updateOne({ shortUrl: shortCode }, { $inc: { clicks: 1 } });
    return res.redirect(301, originalUrl);
  } catch (err) {
    console.error('Redirect Error:', err.message);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};


export const getAnalytics = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const urls = await Url.find({ userId: id });

    // Always return an array
    return res.json(urls);
  } catch (err) {
    console.error('Analytics error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
