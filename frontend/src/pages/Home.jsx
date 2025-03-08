import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
      {user ? (
        <p className="text-lg">Hello, <strong>{user.email}</strong>! Go to your <Link to="/profile" className="text-blue-500 underline">Profile</Link>.</p>
      ) : (
        <div className="space-x-4">
          <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">Login</Link>
          <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded">Register</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
