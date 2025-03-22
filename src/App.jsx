import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import necessary components from React Router
import AdminViewRequests from './AdminDashboard';
import Login from './Login';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        {/* If not logged in, show the login page */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />} />

        {/* If logged in, show the admin page */}
        <Route path="/admin" element={isLoggedIn ? <AdminViewRequests /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
