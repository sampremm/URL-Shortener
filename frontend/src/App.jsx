import React from 'react';
import { BrowserRouter  } from 'react-router-dom';
import AppRouter from './router/Router';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';


const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <AppRouter />
    </BrowserRouter>
  </AuthProvider>
);

export default App;