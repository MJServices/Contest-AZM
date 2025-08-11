import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isAuthenticated || !user) {
    return <div className="loading">Loading...</div>;
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to DecorVista Dashboard</h1>
        <div className="datetime-display">
          <div className="time">{formatTime(currentTime)}</div>
          <div className="date">{formatDate(currentTime)}</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="user-info-card">
          <h3>Your Profile</h3>
          <div className="user-details">
            <div className="detail-item">
              <span className="label">Name:</span>
              <span className="value">
                {user.profile?.firstName} {user.profile?.lastName}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Username:</span>
              <span className="value">{user.username}</span>
            </div>
            <div className="detail-item">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="detail-item">
              <span className="label">Role:</span>
              <span className="value">{user.role}</span>
            </div>
            <div className="detail-item">
              <span className="label">Contact:</span>
              <span className="value">
                {user.profile?.contactNumber || 'Not provided'}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Email Verified:</span>
              <span className={`value ${user.emailVerified ? 'verified' : 'unverified'}`}>
                {user.emailVerified ? '✅ Verified' : '❌ Not Verified'}
              </span>
            </div>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h4>Interior Design Consultation</h4>
            <p>Book a consultation with our expert interior designers</p>
            <button className="feature-btn" disabled>Coming Soon</button>
          </div>

          <div className="feature-card">
            <h4>Design Gallery</h4>
            <p>Browse through our collection of stunning interior designs</p>
            <button className="feature-btn" disabled>Coming Soon</button>
          </div>

          <div className="feature-card">
            <h4>Product Catalog</h4>
            <p>Explore our curated selection of home decor products</p>
            <button className="feature-btn" disabled>Coming Soon</button>
          </div>

          <div className="feature-card">
            <h4>My Projects</h4>
            <p>Manage your ongoing interior design projects</p>
            <button className="feature-btn" disabled>Coming Soon</button>
          </div>
        </div>

        <div className="stats-section">
          <h3>Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Active Projects</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Consultations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Saved Designs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Orders</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;