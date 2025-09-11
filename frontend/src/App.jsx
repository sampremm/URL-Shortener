import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRouter from './router/Router';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Separate component so we can use hooks like useLocation
const AppContent = () => {
  const location = useLocation();

  // Add any paths where you don't want the navbar
  const hideNavbarOn = ['/']; // home page

  const hideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AppRouter />
    </>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
