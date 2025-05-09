import { useState } from "react";
import API from "../";

const UrlForm = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/url/shorten", { originalUrl });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      alert("Error shortening URL");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="url"
        placeholder="Enter your URL"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        className="border p-2 rounded w-80"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Shorten</button>
      {shortUrl && (
        <div>
          <p>Short URL:</p>
          <a href={`http://localhost:3000/url/${shortUrl}`} className="text-blue-500 underline">
            {window.location.origin}/url/{shortUrl}
          </a>
        </div>
      )}
    </form>
  );
};

export default UrlForm;
