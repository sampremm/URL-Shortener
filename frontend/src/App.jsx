import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRouter from './router/Router';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';

const AppContent = () => {
  const location = useLocation();
  const hideNavbarOn = ['/'];
  const hideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AppRouter />
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
