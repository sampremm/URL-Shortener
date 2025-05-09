import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Shorten from '../pages/Shorten';
import Profile from '../pages/Profile';
import Analytics from '../pages/Analytics';
import PrivateRoute from '../auth/PrivateRoute';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/shorten" element={<PrivateRoute><Shorten /></PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
    <Route path="/analytics/:shortUrl" element={<PrivateRoute><Analytics /></PrivateRoute>} />
  </Routes>
);

export default AppRouter;