import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const ProfileAnalytics = () => {
  const { user, token } = useAuth();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const fetchAnalytics = async () => {
    if (!user?._id || !token) return setError('Not authenticated');
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get(`/api/urls/analytics/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setAnalytics(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const msg = err.response?.data?.error;
      setError(typeof msg === 'string' ? msg : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, [user?._id, token]);

  const copyLink = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const barData = analytics.map((item) => ({ name: item.shortUrl, Clicks: item.clicks }));

  const totalClicks = analytics.reduce((s, i) => s + i.clicks, 0);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center pt-14 transition-colors">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-2 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 rounded-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-16 px-4 sm:px-6 transition-colors">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-50">Analytics</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-xs sm:max-w-sm">{user?.email}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={fetchAnalytics}
            className="self-start sm:self-auto text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-4 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
          >
            Refresh
          </motion.button>
        </motion.div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-sm text-red-600 dark:text-red-400 mb-6">
            {error}
          </motion.p>
        )}

        {analytics.length === 0 && !error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-12 text-center transition-colors"
          >
            <p className="text-3xl mb-3">🔗</p>
            <p className="text-gray-400 dark:text-gray-600 text-sm">No links yet.{' '}
              <a href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">Create your first →</a>
            </p>
          </motion.div>
        ) : (
          <>
            {/* Summary stat cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6"
            >
              {[
                { label: 'Total Links', value: analytics.length },
                { label: 'Total Clicks', value: totalClicks },
                { label: 'Avg Clicks', value: analytics.length ? (totalClicks / analytics.length).toFixed(1) : 0 },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 transition-colors"
                >
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Chart */}
            {barData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-6 transition-colors"
              >
                <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-5">Click Overview</h2>
                <div className="h-44 sm:h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.08)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 10,
                          border: '1px solid rgba(128,128,128,0.15)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                        }}
                        cursor={{ fill: 'rgba(99,102,241,0.05)' }}
                      />
                      <Bar dataKey="Clicks" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Mobile: card list, Desktop: table */}
            {/* Mobile cards (hidden sm+) */}
            <div className="sm:hidden space-y-3">
              <AnimatePresence>
                {analytics.map((item, i) => (
                  <motion.div
                    key={item._id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: i * 0.05 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">{item.shortUrl}</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">{item.clicks}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-3">{item.originalUrl}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyLink(`${import.meta.env.VITE_APP_API_URL}/${item.shortUrl}`, item._id)}
                        className={`flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-all ${
                          copiedId === item._id
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {copiedId === item._id ? '✓ Copied' : 'Copy'}
                      </button>
                      <a
                        href={`${import.meta.env.VITE_APP_API_URL}/${item.shortUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all"
                      >
                        Visit
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Desktop table (hidden below sm) */}
            <div className="hidden sm:block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    {['Short URL', 'Original', 'Clicks', 'Expires', 'Actions'].map((h) => (
                      <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="divide-y divide-gray-50 dark:divide-gray-800/60"
                >
                  {analytics.map((item) => (
                    <motion.tr
                      key={item._id}
                      variants={rowVariants}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400 font-semibold">{item.shortUrl}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{item.originalUrl}</td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-50">{item.clicks}</td>
                      <td className="px-6 py-4 text-gray-400 dark:text-gray-600 text-xs">
                        {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyLink(`${import.meta.env.VITE_APP_API_URL}/${item.shortUrl}`, item._id)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                              copiedId === item._id
                                ? 'bg-green-500 text-white border-green-500'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                            }`}
                          >
                            {copiedId === item._id ? '✓ Copied' : 'Copy'}
                          </motion.button>
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={`${import.meta.env.VITE_APP_API_URL}/${item.shortUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-indigo-400 transition-all"
                          >
                            Visit
                          </motion.a>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileAnalytics;
