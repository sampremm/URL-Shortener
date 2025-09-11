import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const ProfileAnalytics = () => {
  const { user, token } = useAuth();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    if (!user?._id || !token) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError('');

    const baseURL = import.meta.env.VITE_APP_API_URL; // your API base URL
    const url = `${baseURL}/analytics/${user._id}`;
    console.log(url);
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      if (Array.isArray(res.data)) {
        setAnalytics(res.data);
      } else if (res.data && res.data.error) {
        setError(res.data.error);
      } else {
        setError('Unexpected response format');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(
        err.code === 'ECONNABORTED'
          ? 'Request timed out. Please check if the server is running.'
          : err.response?.status === 404
          ? 'Analytics endpoint not found.'
          : err.response?.status === 401
          ? 'Unauthorized. Please log in again.'
          : err.response?.data?.error || err.message || 'Failed to load analytics'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user?._id, token]);

  if (loading) return <p className="text-center text-gray-500">Loading analytics...</p>;

  if (error)
    return (
      <div className="text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );

  // Prepare chart data
  const barData = analytics.map((item) => ({
    name: item.shortUrl,
    clicks: item.clicks,
  }));

  const COLORS = ['#4ade80', '#60a5fa', '#facc15', '#f87171'];

  return (
    <motion.div
      className="p-6 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">Your URL Analytics</h2>

      {analytics.length === 0 ? (
        <p className="text-gray-600 text-center">No shortened URLs found.</p>
      ) : (
        <>
          {/* Bar Chart */}
          <h3 className="text-xl font-semibold mb-2">Clicks per URL</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>

          {/* Pie Chart */}
          <h3 className="text-xl font-semibold my-4">Click Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={barData}
                dataKey="clicks"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* URL List */}
          <div className="space-y-4 mt-6">
            {analytics.map((item, index) => (
              <motion.div
                key={item._id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <p>
                  <strong>Original URL:</strong>{' '}
                  <a
                    href={item.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    {item.originalUrl}
                  </a>
                </p>
                <p>
                  <strong>Short URL:</strong>{' '}
                  <a
                    href={`${import.meta.env.VITE_APP_API_URL}/${item.shortUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-600 underline break-all"
                  >
                    {`${import.meta.env.VITE_APP_API_URL}/${item.shortUrl}`}
                  </a>
                </p>
                <p>
                  <strong>Clicks:</strong> {item.clicks}
                </p>
                <p>
                  <strong>Created:</strong>{' '}
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ProfileAnalytics;
