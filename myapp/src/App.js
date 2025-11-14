// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ActivityLogProvider } from './ActivityLogContext';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import TripPlanningPage from './pages/TripPlanningPage';
import PlacesPage from './pages/PlacesPage';
import CityDetailPage from './pages/CityDetailPage';
import BudgetTrackerPage from './pages/BudgetTrackerPage';
import PackingSuggestionsPage from './pages/PackingSuggestionsPage';
import TripHistoryPage from './pages/TripHistoryPage';
import ContactPage from './pages/ContactPage';
import SearchPlacesPage from './pages/SearchPlacesPage'; // NEW: Import SearchPlacesPage

// Simple Header component
const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  };

  const navLinkStyle = {
    color: '#ecf0f1',
    textDecoration: 'none',
    margin: '0 15px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
  };

  const navLinkHoverStyle = {
    color: '#3498db',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#c0392b',
  };

  return (
    <header style={headerStyle}>
      <h1 style={{ margin: 0, fontSize: '1.8em' }}>Vacation Planner</h1>
      <nav>
        <Link to="/" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Home</Link>
        {/* NEW: Contact Link - accessible always */}
        {/* <Link to="/contact" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Contact</Link> */}
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Dashboard</Link>
            <Link to="/trip-history" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Trip History</Link>
            <button
              onClick={logout}
              style={buttonStyle}
              onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
              onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Login</Link>
            <Link to="/register" style={navLinkStyle} onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color} onMouseOut={(e) => e.target.style.color = navLinkStyle.color}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

// Simple Footer component
const Footer = () => {
  const footerStyle = {
    padding: '20px 40px',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    textAlign: 'center',
    marginTop: 'auto',
    boxShadow: '0 -2px 5px rgba(0,0,0,0.2)',
  };
  return (
    <footer style={footerStyle}>
      <p>&copy; 2025 Smart Vacation Planner. All rights reserved.</p>
    </footer>
  );
};

// Private Route Component - ensures only authenticated users can access
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '2em', color: '#34495e' }}>
        Loading...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};


const App = () => {
  const appContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f4f7f6',
    color: '#34495e',
  };

  const mainContentStyle = {
    flexGrow: 1,
    padding: '20px 40px',
  };

  return (
    <Router>
      <div style={appContainerStyle}>
        <Header />
        <main style={mainContentStyle}>
          <ActivityLogProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* NEW ROUTE: Contact Page - accessible without login */}
              <Route path="/contact" element={<ContactPage />} />
              <Route
                path="/welcome"
                element={
                  <PrivateRoute>
                    <WelcomePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/plan-trip"
                element={
                  <PrivateRoute>
                    <TripPlanningPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/places"
                element={
                  <PrivateRoute>
                    <PlacesPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/city/:cityId"
                element={
                  <PrivateRoute>
                    <CityDetailPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/budget-tracker"
                element={
                  <PrivateRoute>
                    <BudgetTrackerPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/packing-suggestions"
                element={
                  <PrivateRoute>
                    <PackingSuggestionsPage />
                  </PrivateRoute>
                }
              />
              {/* NEW ROUTE: Trip History Page */}
              <Route
                path="/trip-history"
                element={
                  <PrivateRoute>
                    <TripHistoryPage />
                  </PrivateRoute>
                }
              />
              {/* NEW ROUTE: Search Places Page */}
              <Route
                path="/search-places"
                element={
                  <PrivateRoute>
                    <SearchPlacesPage />
                  </PrivateRoute>
                }
              />
              {/* Catch-all for undefined routes */}
              <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '50px', color: '#e74c3c' }}>404 - Page Not Found</h2>} />
            </Routes>
          </ActivityLogProvider>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
