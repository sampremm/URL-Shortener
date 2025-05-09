import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Analytics = () => {
  const { shortUrl } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get(`/url/analytics/${shortUrl}`);
        setData(res.data);
      } catch (err) {
        alert('Failed to load analytics');
      }
    };
    fetchAnalytics();
  }, [shortUrl]);

  if (!data) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Analytics</h2>
        <p><strong>Original URL:</strong> {data.originalUrl}</p>
        <p><strong>Short URL:</strong> {data.shortUrl}</p>
        <p><strong>Clicks:</strong> {data.clicks}</p>
        <p><strong>Created At:</strong> {new Date(data.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Analytics;
