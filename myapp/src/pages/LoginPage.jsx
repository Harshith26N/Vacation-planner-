// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const pageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 120px)', // Adjust based on header/footer height
    backgroundColor: '#f4f7f6',
  };

  const formContainerStyle = {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  };

  const headingStyle = {
    color: '#34495e',
    marginBottom: '30px',
    fontSize: '2em',
  };

  const inputGroupStyle = {
    marginBottom: '20px',
    textAlign: 'left',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
  };

  const inputStyle = {
    width: 'calc(100% - 20px)',
    padding: '12px 10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1em',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };

  const inputFocusStyle = {
    borderColor: '#3498db',
    boxShadow: '0 0 8px rgba(52, 152, 219, 0.3)',
    outline: 'none',
  };

  const buttonStyle = {
    width: '100%',
    padding: '15px',
    backgroundColor: '#27ae60', // Green for login
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#229a56',
    transform: 'translateY(-2px)',
  };

  const errorStyle = {
    color: '#e74c3c', // Red for errors
    marginTop: '15px',
    fontSize: '0.9em',
    fontWeight: 'bold',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/welcome'); // Redirect to the new Welcome page
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <h2 style={headingStyle}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label htmlFor="username" style={labelStyle}>Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
          >
            Login
          </button>
          {error && <p style={errorStyle}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;