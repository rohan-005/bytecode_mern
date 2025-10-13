import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { user } = useAuth();

  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <Link to={user ? "/dashboard" : "/"} className="home-btn">
          Go to {user ? "Dashboard" : "Home"}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;