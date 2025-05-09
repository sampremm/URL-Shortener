import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const Shorten = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleShorten = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/url/shorten', { originalUrl });
      setShortUrl(`${window.location.origin}/${res.data.shortUrl}`);
    } catch (err) {
      alert('Failed to shorten URL');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleShorten} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Shorten a URL</h2>
        <input type="url" value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} placeholder="Enter original URL" className="w-full mb-3 p-2 border rounded" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">Shorten</button>
        {shortUrl && (
          <p className="mt-4 text-center text-green-700">Short URL: <a href={shortUrl} className="underline" target="_blank">{shortUrl}</a></p>
        )}
      </form>
    </div>
  );
};

export default Shorten;