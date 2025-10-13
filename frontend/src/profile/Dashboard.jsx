import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>Dashboard</h2>
        </div>
        <div className="nav-items">
          <span>Welcome, {user?.name}</span>
          <Link to="/profile" className="nav-link">Profile</Link>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h1>Hello, {user?.name}! 👋</h1>
          <div className="user-info">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Member since:</strong> {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="dashboard-actions">
            <Link to="/profile" className="action-btn">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;