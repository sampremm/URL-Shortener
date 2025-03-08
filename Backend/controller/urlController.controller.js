import Url from "../model/url.js";
import { nanoid } from "nanoid";

export const shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "URL is required" });
  }

  const shortUrl = nanoid(8);
  const newUrl = new Url({ originalUrl, shortUrl });
  await newUrl.save();

  res.json({ shortUrl, originalUrl });
};

export const redirectUrl = async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });

  if (!url) {
      return res.status(404).json({ error: "URL not found" });
  }

  // Increment clicks counter
  url.clicks++;
  await url.save();

  // Correct redirect
  return res.redirect(url.originalUrl);  // Should redirect to the original URL
};

export const analyticsurl = async (req, res) => {
  try{
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });
  if(!url) return res.status(404).json({ error: "URL not found" });
  res.json({
    originalUrl: url.originalUrl,
    shortUrl: url.shortUrl,
    clicks: url.clicks,
    createdAt: url.createdAt,
  });
  }
  catch(err){
    return res.status(400).console.log(err);
  }
};
