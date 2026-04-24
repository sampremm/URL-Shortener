import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
  </svg>
);
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
);

/* ── Animation Variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const resultVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.96, y: -8, transition: { duration: 0.2 } },
};

/* ── Feature chips shown below the card ── */
const features = [
  { icon: '⚡', label: 'Instant shortening' },
  { icon: '📊', label: 'Click analytics' },
  { icon: '🔗', label: 'Custom aliases' },
  { icon: '🌗', label: 'Dark & light mode' },
];

const Home = () => {
  const { user, token } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [originalUrl, setOriginalUrl] = useState('');
  const [customURL, setCustomURL] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortId, setShortId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');
    setCopied(false);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 transition-colors">
      {/* Theme toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-50"
        aria-label="Toggle dark mode"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </motion.button>

      {/* Main card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        {/* Logo + heading */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-2xl mb-4 shadow-lg shadow-indigo-500/30 mx-auto"
          >
            /
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
            SnapLink
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            {user
              ? <>Signed in as <span className="font-medium text-gray-700 dark:text-gray-300">{user.email}</span></>
              : 'Shorten any URL instantly. No account needed.'}
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm dark:shadow-gray-900/60 border border-gray-100 dark:border-gray-800 p-6 sm:p-8 transition-colors"
        >
          <form onSubmit={handleShorten} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                Destination URL
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://your-long-url.com/article/..."
                required
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                Custom alias <span className="normal-case text-gray-400 dark:text-gray-600 font-normal">(optional)</span>
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                value={customURL}
                onChange={(e) => setCustomURL(e.target.value)}
                placeholder="my-brand-name"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Processing…
                </span>
              ) : 'Shorten URL'}
            </motion.button>
          </form>

          {/* Error / Result */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                variants={resultVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-4 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 rounded-xl p-3 text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}

            {shortUrl && (
              <motion.div
                key="result"
                variants={resultVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-xl p-4 space-y-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 dark:text-indigo-500">
                  Your short link
                </p>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 break-all hover:underline"
                >
                  {shortUrl}
                </a>
                <div className="flex flex-wrap gap-2 pt-1">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleCopy}
                    className={`flex-1 text-xs font-semibold py-2 rounded-lg border transition-all ${
                      copied
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                    }`}
                  >
                    {copied ? '✓ Copied!' : 'Copy Link'}
                  </motion.button>
                  {user && (
                    <Link
                      to={`/analytics/${shortId}`}
                      className="flex-1 text-center text-xs font-semibold py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-indigo-400 transition-all"
                    >
                      View analytics →
                    </Link>
                  )}
                </div>
                {!user && (
                  <p className="text-xs text-indigo-400/70 dark:text-indigo-500/60">
                    ⏱ Guest link expires in 24 h.{' '}
                    <Link to="/signup" className="underline hover:text-indigo-600 dark:hover:text-indigo-400">Sign up</Link>
                    {' '}for permanent links.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer nav */}
        <motion.div
          variants={itemVariants}
          className="mt-5 flex justify-center gap-6 text-sm"
        >
          {user ? (
            <Link to="/profile" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Login</Link>
              <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Sign Up Free</Link>
            </>
          )}
        </motion.div>

        {/* Feature chips */}
        <motion.div
          variants={itemVariants}
          className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {features.map((f) => (
            <motion.div
              key={f.label}
              whileHover={{ y: -2 }}
              className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-3 py-2.5 text-xs text-gray-600 dark:text-gray-400 shadow-sm transition-colors"
            >
              <span>{f.icon}</span>
              <span className="font-medium">{f.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
