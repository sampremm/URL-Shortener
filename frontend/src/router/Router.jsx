import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Shorten from '../pages/Shorten';
import ProfileAnalytics from '../pages/ProfileAnalytics';
import PrivateRoute from '../auth/PrivateRoute';


const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/shorten" element={<PrivateRoute><Shorten /></PrivateRoute>} />
    <Route path='/profile'element={<PrivateRoute><ProfileAnalytics /></PrivateRoute>} />
  </Routes>
);

export default AppRouter;