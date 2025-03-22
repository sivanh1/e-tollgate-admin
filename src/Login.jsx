import React, { useState } from 'react';
import backgroundImg from './assets/tollgate.jpg'; // Adjust the path based on your folder structure

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === 'admin123') {
      onLogin();
      setError('');
    } else {
      setError('Invalid credentials, please try again!');
    }
  };

  return (
    <div style={{ ...containerStyle, backgroundImage: `url(${backgroundImg})` }}>
      <div style={overlayStyle}>
        <h1 style={headingStyle}>Toll Tax Management System</h1>
        <div style={formBoxStyle}>
          <p style={labelStyle}>Please enter your credentials</p>
          <form onSubmit={handleSubmit}>
            <div style={inputGroupStyle}>
              <input
                type="email"
                placeholder="admin-"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
              <span style={iconStyle}>👤</span>
            </div>
            <div style={inputGroupStyle}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <span style={iconStyle}>🔒</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <a href="https://tollgate-user.netlify.app/" style={linkStyle}>Go to Website</a>
              <button type="submit" style={signInButtonStyle}>Sign In</button>
            </div>
            {error && <p style={errorStyle}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  minWidth: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Arial, sans-serif',
  position: 'relative',
};

const overlayStyle = {
  backgroundColor: 'rgba(0,0,0,0.5)',
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: 'white',
};

const headingStyle = {
  fontSize: '40px',
  marginBottom: '20px',
  fontWeight: 'bold',
  textShadow: '2px 2px 5px rgba(0,0,0,0.5)',
};

const formBoxStyle = {
  backgroundColor: 'white',
  padding: '30px 40px',
  width: '90%',
  maxWidth: '400px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
  color: '#000',
};

const labelStyle = {
  fontSize: '16px',
  marginBottom: '15px',
};

const inputGroupStyle = {
  position: 'relative',
  marginBottom: '15px',
};

const inputStyle = {
  width: '90%',
  padding: '12px 40px 12px 10px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  color: 'black',
  backgroundColor: 'rgba(0,0,0,0)',
};

const iconStyle = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '18px',
  color: '#555',
};

const linkStyle = {
  fontSize: '14px',
  color: '#007BFF',
  textDecoration: 'none',
};

const signInButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007BFF',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const errorStyle = {
  color: '#D32F2F',
  marginTop: '10px',
  fontSize: '14px',
};

export default AdminLogin;
