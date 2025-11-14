// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { register } = useAuth();
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
    maxWidth: '450px',
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
    backgroundColor: '#3498db', // Blue for register
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
    backgroundColor: '#2980b9',
    transform: 'translateY(-2px)',
  };

  const errorStyle = {
    color: '#e74c3c',
    marginTop: '15px',
    fontSize: '0.9em',
    fontWeight: 'bold',
  };

  const successStyle = {
    color: '#27ae60',
    marginTop: '15px',
    fontSize: '1em',
    fontWeight: 'bold',
  };

  const passwordHintStyle = {
    fontSize: '0.85em',
    color: '#777',
    marginTop: '5px',
    marginBottom: '10px',
    lineHeight: '1.4',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Client-side password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+[{}}\\|;:'",<.>/?`~])[A-Za-z\d!@#$%^&*()-_=+[{}}\\|;:'",<.>/?`~]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = await register(username, email, password);
    if (result.success) {
      setSuccessMessage(result.message + ' You can now log in!');
      // Optionally redirect after a short delay
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <h2 style={headingStyle}>Register</h2>
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
            <label htmlFor="email" style={labelStyle}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <p style={passwordHintStyle}>
              Min. 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.
            </p>
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Register
          </button>
          {error && <p style={errorStyle}>{error}</p>}
          {successMessage && <p style={successStyle}>{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;