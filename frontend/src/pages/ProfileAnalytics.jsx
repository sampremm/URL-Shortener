import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProfileAnalytics = () => {
  const { user, token } = useAuth();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    if (!user?._id || !token) {
      console.warn('User ID or token is undefined:', { user, token });
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    const baseURL = import.meta.env.VITE_API_URL;
    const url = `${baseURL}/analytics/${user._id}`; // Fixed endpoint

    console.log('Fetching analytics from:', url, 'Token:', token);

    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000, // 10-second timeout
      });

      console.log('API Response:', res.data);

      if (Array.isArray(res.data)) {
        setAnalytics(res.data);
        setError('');
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Axios error details:', {
        url,
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      setError(
        err.code === 'ECONNABORTED'
          ? 'Request timed out. Please check if the server is running.'
          : err.response?.status === 404
          ? 'Analytics endpoint not found. Check server configuration.'
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

  if (loading) {
    return <p className="text-center text-gray-500">Loading analytics...</p>;
  }

  if (error) {
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
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Your URL Analytics</h2>
      {analytics.length === 0 ? (
        <p className="text-gray-600">No shortened URLs found.</p>
      ) : (
        <div className="space-y-4">
          {analytics.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <p>
                <strong>Original URL:</strong>{' '}
                <a
                  href={item.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {item.originalUrl}
                </a>
              </p>
              <p>
                <strong>Short URL:</strong>{' '}
                <a
                  href={`${import.meta.env.VITE_API_URL}/${item.shortUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-600 underline"
                >
                  {`${import.meta.env.VITE_API_URL}/${item.shortUrl}`}
                </a>
              </p>
              <p>
                <strong>Clicks:</strong> {item.clicks}
              </p>
              <p>
                <strong>Created:</strong>{' '}
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileAnalytics;