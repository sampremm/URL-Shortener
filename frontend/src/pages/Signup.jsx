import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion'; // <-- import motion

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/url/auth/register",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(res.data);
      alert('Signup successful');
      const token = res.data.token;
      localStorage.setItem('token', token);
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Signup failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      {/* motion.div wrapper for animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-80"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full mb-3 p-2 border rounded"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
