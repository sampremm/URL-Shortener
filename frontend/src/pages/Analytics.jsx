import { useEffect, useState } from 'react';
import axios from 'axios';

function Analytics() {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('/api/analytics');
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div>
      <h2>Analytics</h2>
      <table>
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Clicks</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {analytics.map((item, index) => (
            <tr key={index}>
              <td>{item.shortUrl}</td>
              <td>{item.clicks}</td>
              <td>{item.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Analytics;
