import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get('http://localhost:3000/url/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
          localStorage.setItem('token', token);
        } catch (err) {
          console.error('Failed to fetch user:', err);
          setToken('');
          setUser(null);
          localStorage.removeItem('token');
        }
      }
    };
    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);