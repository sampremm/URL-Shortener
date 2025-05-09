import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 to-purple-300 p-8">
      <img src="/logo.png" alt="logo" className="w-40 h-40 mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to URL Shortener</h1>
      {user ? (
        <p className="text-lg">Hello, <strong>{user.email}</strong>! Go to your <Link to="/profile" className="text-blue-600 underline">Profile</Link>.</p>
      ) : (
        <div className="flex space-x-4">
          <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">Login</Link>
          <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded">Register</Link>
        </div>
      )}
    </div>
  );
};

export default Home;