import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/Auth';
import { DashboardPage } from './pages/Dashboard';

// A simple wrapper component for the login page that handles redirection
// This simulates a successful login. In a real app, LoginPage itself
// would trigger navigation based on actual authentication success.
const LoginPageWrapper: React.FC = () => {
  const navigate = useNavigate();

  // This function will be passed to LoginPage to tell it what to do on success
  const handleLoginSuccess = () => {
    // Simulate setting an auth token (e.g., localStorage.setItem('authToken', 'some_token');)
    console.log('Login successful. Redirecting to dashboard...');
    navigate('/dashboard');
  };

  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route for Login */}
        <Route path='/' element={<LoginPageWrapper />} />

        {/* Protected Route for Dashboard (conceptually for now) */}
        {/* In a real app, this would be wrapped in a PrivateRoute component */}
        <Route path='/dashboard' element={<DashboardPage />} />

        {/* Fallback for unknown routes */}
        <Route
          path='*'
          element={
            <div className='min-h-screen flex items-center justify-center bg-gray-100'>
              <h1 className='text-4xl font-bold text-gray-800'>404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
