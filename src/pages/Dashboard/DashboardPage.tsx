import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

// Import Redux hooks and actions/selectors
import { useDispatch, useSelector } from 'react-redux';
import { logout, RootState, AppDispatch } from '../../redux'; // Assuming you added index.ts barrel export in redux

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Get user and logout from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const userName = user ? user.name : 'Guest'; // Use user.name from Redux state
  const walletBalance = '12,345.67 NEXER';
  const [nodeStatus, setNodeStatus] = useState<'Active' | 'Not Active' | 'Pending' | 'Offline'>('Not Active');

  const handleBecomeNode = () => {
    alert('Simulating "Become a Node" process...');
    console.log('User initiated "Become a Node".');
  };

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    // Redirection to login page will happen automatically due to PrivateRoute logic
  };

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      {/* Header */}
      <header className='flex justify-between items-center mb-8 pb-4 border-b border-gray-300'>
        <h1 className='text-3xl font-bold text-gray-900'>Welcome, {userName}!</h1>
        <Button onClick={handleLogout} className='bg-red-500 hover:bg-red-700'>
          Logout
        </Button>
      </header>

      {/* Dashboard Content Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Wallet Balance Card */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Wallet Balance</h2>
          <p className='text-4xl font-bold text-blue-600 mb-2'>{walletBalance}</p>
          <p className='text-sm text-gray-500'>Your current NEXER Coin balance</p>
          <button className='mt-4 text-blue-500 hover:underline text-sm'>View Transaction History</button>
        </div>

        {/* Node Status Card */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Node Status</h2>
          <p className='text-3xl font-bold text-green-600 mb-2'>{nodeStatus}</p>
          <p className='text-sm text-gray-500'>Current status of your device as a node</p>
          <Button onClick={handleBecomeNode} className='mt-4 bg-green-500 hover:bg-green-600'>
            {nodeStatus === 'Active' ? 'Manage Node' : 'Become a Node'}
          </Button>
        </div>

        {/* Placeholder for Analytics Card */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Resource Analytics</h2>
          <p className='text-sm text-gray-500'>
            Graphs and charts showing your storage contribution, processing usage, and earnings over time.
          </p>
          <button className='mt-4 text-blue-500 hover:underline text-sm'>View Detailed Analytics</button>
        </div>

        {/* Placeholder for Data Storage Card */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Decentralized Storage</h2>
          <p className='text-sm text-gray-500'>Upload, manage, and access your encrypted files on the Trust Chain network.</p>
          <button className='mt-4 text-blue-500 hover:underline text-sm'>Manage My Files</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
