import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Provider
import { store } from './redux/store'; // Import your Redux store

import { LoginPage } from './pages/Auth';
import { DashboardPage } from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Route for Login */}
          {/* <Route path='/' element={<LoginPageWrapper />} /> */}
          <Route path='/' element={<LoginPage />} />

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
    </Provider>
  );
};

export default App;
