import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';

const Shorten = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customURL, setCustomURL] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortId, setShortId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        : { withCredentials: true };
      const payload = { originalUrl };
      if (customURL) payload.customURL = customURL;
      const res = await axiosInstance.post('/api/urls', payload, config);
      const base = import.meta.env.VITE_APP_BASE_URL || import.meta.env.VITE_APP_API_URL;
      const fullShortUrl = `${base}/${res.data.shortUrl}`;
      setShortUrl(fullShortUrl);
      setShortId(res.data.shortUrl);
    } catch (err) {
      const msg = err.response?.data?.error;
      setError(typeof msg === 'string' ? msg : 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 pt-20 transition-colors"
    >
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-md dark:shadow-gray-900/60 p-8 transition-colors">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-indigo-600 text-white font-bold text-lg mb-3">/</div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Create a Short Link</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user ? `Signed in as ${user.email}` : 'Guest — link expires in 24 h'}
          </p>
        </div>

        <form onSubmit={handleShorten} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Long URL</label>
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://your-long-url.com/..."
              required
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Custom alias <span className="text-gray-400 dark:text-gray-600">(optional)</span>
            </label>
            <input
              type="text"
              value={customURL}
              onChange={(e) => setCustomURL(e.target.value)}
              placeholder="my-brand"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-medium py-2 rounded-md text-sm hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing…' : 'Shorten'}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mt-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </motion.p>
          )}
          {shortUrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-4 border border-gray-100 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 transition-colors">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your short link</p>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 break-all text-sm">
                {shortUrl}
              </a>
              {user && (
                <div className="mt-3">
                  <Link to={`/analytics/${shortId}`}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                    View analytics →
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Shorten;
