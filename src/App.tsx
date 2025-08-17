import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';

import { LoginPage, SignupPage } from './pages/Auth'; // Import SignupPage
import { HomePage } from './pages/Home';
import { AssetListPage } from './pages/AssetList';
import { CreateAssetPage } from './pages/CreateAsset';
import { AdminDashboardPage } from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

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
            <Route element={<Layout />}>
              <Route path='/home' element={<HomePage />} />
              <Route path='/assets' element={<AssetListPage />} />
              <Route path='/create-asset' element={<CreateAssetPage />} />
              <Route path='/admin' element={<AdminDashboardPage />} />
            </Route>
          </Route>
          {/* Fallback for unknown routes */}
          <Route
            path='*'
            element={
              <div className='flex items-center justify-center min-h-screen bg-gray-100'>
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
