import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router/Router';
import AuthProvider from './context/AuthContext';
import Navbar from './components/Navbar';

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar />
      <AppRouter />
    </Router>
  </AuthProvider>
);

export default App;