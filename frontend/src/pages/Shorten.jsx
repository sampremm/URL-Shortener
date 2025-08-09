import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Shorten = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const config = user?.token
        ? {
            headers: { Authorization: `Bearer ${user.token}` },
            withCredentials: true,
          }
        : { withCredentials: true };

      const res = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/shorten`, // VITE_APP_API_URL should be http://localhost:3000
        { originalUrl },
        config
      );

      // Assuming the backend returns { shortUrl: 'QfA2hC7c' }
      const fullShortUrl = `${import.meta.env.VITE_APP_API_URL}/${res.data.shortUrl}`;
      setShortUrl(fullShortUrl);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shorten URL');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleShorten}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Shorten a URL</h2>
        <input
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter original URL"
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Shorten
        </button>

        {error && (
          <p className="mt-2 text-red-600 text-center">{error}</p>
        )}

        {shortUrl && (
          <p className="mt-4 text-center text-green-700">
            Short URL:{' '}
            <a
              href={shortUrl}
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortUrl}
            </a>
          </p>
        )}
      </form>
    </div>
  );
};

export default Shorten;
