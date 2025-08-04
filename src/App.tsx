import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';

import { LoginPage, SignupPage } from './pages/Auth'; // Import SignupPage
import { DashboardPage } from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} /> {/* NEW ROUTE */}
          {/* Protected Routes Group */}
          <Route element={<PrivateRoute />}>
            <Route path='/dashboard' element={<DashboardPage />} />
            {/* Add other protected routes here */}
          </Route>
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
