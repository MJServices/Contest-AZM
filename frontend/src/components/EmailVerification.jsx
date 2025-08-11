import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import './Auth.css';

const EmailVerification = () => {
  const { token } = useParams();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const result = await verifyEmail(token);
        
        if (result.success) {
          setStatus('success');
          setMessage(result.message);
        } else {
          setStatus('error');
          setMessage(result.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Email verification failed. Please try again.');
      }
    };

    handleVerification();
  }, [token, verifyEmail]);

  if (status === 'verifying') {
    return <LoadingSpinner message="Verifying your email..." />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Email Verification</h2>
        
        <div className={`message ${status === 'success' ? 'success-message' : 'error-message'}`}>
          {status === 'success' ? '✅' : '❌'} {message}
        </div>

        <div className="auth-links">
          {status === 'success' ? (
            <Link to="/login" className="auth-btn">
              Continue to Login
            </Link>
          ) : (
            <div>
              <Link to="/login">Back to Login</Link>
              <br />
              <Link to="/register">Create New Account</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;