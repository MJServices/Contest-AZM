import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Calendar, User, CheckCircle, Star, Palette, Home, TrendingUp } from 'lucide-react';

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
    <div className="container-custom py-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pb-6 border-b-2 border-neutral-200">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-2">
            Welcome to DecorVista
          </h1>
          <p className="text-lg text-neutral-600">Transform your space with expert design</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="text-right">
            <div className="flex items-center space-x-2 text-2xl font-semibold text-primary-600 mb-1">
              <Clock size={24} />
              <span>{formatTime(currentTime)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <Calendar size={16} />
              <span>{formatDate(currentTime)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* User Profile Card */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="text-primary-600" size={24} />
            <h3 className="text-2xl font-semibold text-neutral-900">Your Profile</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-medium text-neutral-700">Name:</span>
              <span className="text-neutral-900 font-medium">
                {user.profile?.firstname} {user.profile?.lastname}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-medium text-neutral-700">Username:</span>
              <span className="text-neutral-900 font-medium">{user.username}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-medium text-neutral-700">Email:</span>
              <span className="text-neutral-900 font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-medium text-neutral-700">Role:</span>
              <span className="text-neutral-900 font-medium capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-medium text-neutral-700">Contact:</span>
              <span className="text-neutral-900 font-medium">
                {user.profile?.contactNumber || 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="font-medium text-neutral-700">Email Status:</span>
              <span className={`font-medium flex items-center space-x-1 ${user.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                <CheckCircle size={16} />
                <span>{user.emailVerified ? 'Verified' : 'Not Verified'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-hover p-6 text-center">
            <div className="flex justify-center mb-4">
              <Calendar className="text-primary-600" size={48} />
            </div>
            <h4 className="text-xl font-semibold text-neutral-900 mb-3">Interior Design Consultation</h4>
            <p className="text-neutral-600 mb-6 leading-relaxed">Book a consultation with our expert interior designers</p>
            <button className="btn-primary w-full" disabled>
              Coming Soon
            </button>
          </div>

          <div className="card-hover p-6 text-center">
            <div className="flex justify-center mb-4">
              <Palette className="text-primary-600" size={48} />
            </div>
            <h4 className="text-xl font-semibold text-neutral-900 mb-3">Design Gallery</h4>
            <p className="text-neutral-600 mb-6 leading-relaxed">Browse through our collection of stunning interior designs</p>
            <button className="btn-primary w-full" disabled>
              Coming Soon
            </button>
          </div>

          <div className="card-hover p-6 text-center">
            <div className="flex justify-center mb-4">
              <Star className="text-primary-600" size={48} />
            </div>
            <h4 className="text-xl font-semibold text-neutral-900 mb-3">Product Catalog</h4>
            <p className="text-neutral-600 mb-6 leading-relaxed">Explore our curated selection of home decor products</p>
            <button className="btn-primary w-full" disabled>
              Coming Soon
            </button>
          </div>

          <div className="card-hover p-6 text-center">
            <div className="flex justify-center mb-4">
              <Home className="text-primary-600" size={48} />
            </div>
            <h4 className="text-xl font-semibold text-neutral-900 mb-3">My Projects</h4>
            <p className="text-neutral-600 mb-6 leading-relaxed">Manage your ongoing interior design projects</p>
            <button className="btn-primary w-full" disabled>
              Coming Soon
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="text-primary-600" size={24} />
            <h3 className="text-2xl font-semibold text-neutral-900">Quick Stats</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border border-primary-200">
              <div className="text-4xl font-bold text-primary-600 mb-2">0</div>
              <div className="text-sm font-medium text-primary-700">Active Projects</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-accent-green/10 to-accent-green/20 rounded-2xl border border-accent-green/30">
              <div className="text-4xl font-bold text-green-600 mb-2">0</div>
              <div className="text-sm font-medium text-green-700">Consultations</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-accent-gold/10 to-accent-gold/20 rounded-2xl border border-accent-gold/30">
              <div className="text-4xl font-bold text-yellow-600 mb-2">0</div>
              <div className="text-sm font-medium text-yellow-700">Saved Designs</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
              <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-sm font-medium text-purple-700">Orders</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;