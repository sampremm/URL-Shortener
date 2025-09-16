import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/icons.png';

const Home = () => {
  const { user } = useAuth();

  return (
    // Full screen section with animated gradient background
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x"></div>

      {/* Optional gradient overlay animation */}
      <style>
        {`
        @keyframes gradient-x {
          0%, 100% {background-position:0% 50%}
          50% {background-position:100% 50%}
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease infinite;
        }
        `}
      </style>

      {/* Content container with glass effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex flex-col items-center bg-white/20 backdrop-blur-lg rounded-3xl p-10 shadow-xl"
      >
        {/* Animated logo */}
        <img src={logo} alt="logo" className="w-32 h-32 mb-6 animate-bounce" />

        {/* Gradient heading */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Welcome to URL Shortener
        </motion.h1>

        {user ? (
          <p className="text-lg text-gray-900">
            Hello, <strong>{user.email}</strong>! Go to your{' '}
            <Link
              to="/profile"
              className="text-purple-700 underline hover:text-pink-600 transition"
            >
              Profile
            </Link>.
          </p>
        ) : (
          <div className="flex space-x-4 mt-4">
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-xl shadow-md transition transform hover:scale-105 hover:shadow-lg"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-green-400 to-emerald-600 text-white px-5 py-2 rounded-xl shadow-md transition transform hover:scale-105 hover:shadow-lg"
            >
              Register
            </Link>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Home;
