// frontend/src/pages/HomePage.jsx
import React from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  const pageStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: '40px auto',
  };

  const headingStyle = {
    color: '#34495e',
    fontSize: '2.8em',
    marginBottom: '20px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  };

  const paragraphStyle = {
    fontSize: '1.2em',
    lineHeight: '1.6',
    color: '#555',
    marginBottom: '30px',
  };

  const ctaButtonStyle = {
    display: 'inline-block',
    padding: '15px 30px',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '1.3em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  };

  const ctaButtonHoverStyle = {
    backgroundColor: '#2980b9',
    transform: 'translateY(-2px)',
  };

  return (
    <div style={pageStyle}>
      <h2 style={headingStyle}>Welcome to Your Smart Vacation Planner!</h2>
      {isAuthenticated && user ? (
        <p style={paragraphStyle}>
          Hello, <strong style={{ color: '#3498db' }}>{user.username}</strong>! Start planning your next adventure from your dashboard.
        </p>
      ) : (
        <p style={paragraphStyle}>
          Your ultimate tool for seamless travel planning. Organize, discover, and enjoy your trips like never before.
        </p>
      )}

      {isAuthenticated ? (
        <Link
          to="/dashboard"
          style={ctaButtonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = ctaButtonHoverStyle.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = ctaButtonStyle.backgroundColor}
        >
          Go to Dashboard
        </Link>
      ) : (
        <Link
          to="/register"
          style={ctaButtonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = ctaButtonHoverStyle.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = ctaButtonStyle.backgroundColor}
        >
          Get Started - It's Free!
        </Link>
      )}
    </div>
  );
};

export default HomePage;