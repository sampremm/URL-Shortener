import { useState } from 'react';
import axios from 'axios';

function URLShortener() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/shorten', { url });
      setShortenedUrl(response.data.shortenedUrl);
    } catch (error) {
      console.error("Error shortening URL", error);
    }
  };

  return (
    <div>
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Shorten URL</button>
      </form>
      {shortenedUrl && <p>Shortened URL: {shortenedUrl}</p>}
    </div>
  );
}

export default URLShortener;
