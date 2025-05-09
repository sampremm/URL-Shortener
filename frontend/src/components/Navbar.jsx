import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const Navbar = () => {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    await axiosInstance.post('/url/auth/logout');
    setUser(null);
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl">URL Shortener</Link>
      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/shorten">Shorten</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;