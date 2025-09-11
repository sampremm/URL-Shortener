import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/icons.png';

const Home = () => {
  const { user } = useAuth();

  return (
    // Animate the entire section
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 to-purple-300 p-8"
    >
      {/* Animated logo */}
      <img
        src={logo}
        alt="logo"
        className="w-40 h-40 mb-6 animate-bounce"
      />

      {/* Animated heading */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl font-bold text-gray-900 mb-4"
      >
        Welcome to URL Shortener
      </motion.h1>

      {user ? (
        <p className="text-lg">
          Hello, <strong>{user.email}</strong>! Go to your{' '}
          <Link to="/profile" className="text-blue-600 underline">
            Profile
          </Link>.
        </p>
      ) : (
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded 
                       transition duration-300 transform 
                       hover:scale-105 hover:bg-blue-600"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-green-500 text-white px-4 py-2 rounded 
                       transition duration-300 transform 
                       hover:scale-105 hover:bg-green-600"
          >
            Register
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default Home;
