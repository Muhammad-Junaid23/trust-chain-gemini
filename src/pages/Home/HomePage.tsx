import React, { useState } from 'react';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { logout, RootState, AppDispatch } from '../../redux';
import { ConnectWalletButton } from '../../components';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const [nodeStatus, setNodeStatus] = useState<'Active' | 'Not Active' | 'Pending' | 'Offline'>('Not Active');

  // Change to use user.name instead of user.email
  const userName = user ? user.name : 'Guest';

  const walletBalance = '12,345.67 NEXER';

  const handleBecomeNode = () => {
    alert('Simulating "Become a Node" process...');
    console.log('User initiated "Become a Node".');
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className='min-h-screen p-8 '>
      {/* Header */}
      <header className='flex items-center justify-between pb-4 mb-8 border-b border-gray-300'>
        <h1 className='text-3xl font-bold text-gray-900'>Welcome, {userName}!</h1>
        <div className='flex items-center space-x-4'>
          <ConnectWalletButton />
          <Button onClick={handleLogout} className='bg-red-500 hover:bg-red-700'>
            Logout
          </Button>
        </div>
      </header>

      {/* Dashboard Content Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Wallet Balance Card (for Trust Chain specific token) */}
        <div className='p-6 bg-white rounded-lg shadow-md'>
          <h2 className='mb-4 text-xl font-semibold text-gray-800'>Trust Chain Wallet Balance</h2>
          <p className='mb-2 text-4xl font-bold text-blue-600'>{walletBalance}</p>
          <p className='text-sm text-gray-500'>Your current NEXER Coin balance on Trust Chain</p>
          <button className='mt-4 text-sm text-blue-500 hover:underline'>View Trust Chain Transaction History</button>
        </div>

        {/* Node Status Card */}
        <div className='p-6 bg-white rounded-lg shadow-md'>
          <h2 className='mb-4 text-xl font-semibold text-gray-800'>Node Status</h2>
          <p className='mb-2 text-3xl font-bold text-green-600'>{nodeStatus}</p>
          <p className='text-sm text-gray-500'>Current status of your device as a node</p>
          <Button onClick={handleBecomeNode} className='mt-4 bg-green-500 hover:bg-green-600'>
            {nodeStatus === 'Active' ? 'Manage Node' : 'Become a Node'}
          </Button>
        </div>

        {/* Placeholder for Analytics Card */}
        <div className='p-6 bg-white rounded-lg shadow-md'>
          <h2 className='mb-4 text-xl font-semibold text-gray-800'>Resource Analytics</h2>
          <p className='text-sm text-gray-500'>
            Graphs and charts showing your storage contribution, processing usage, and earnings over time.
          </p>
          <button className='mt-4 text-sm text-blue-500 hover:underline'>View Detailed Analytics</button>
        </div>

        {/* Placeholder for Data Storage Card */}
        <div className='p-6 bg-white rounded-lg shadow-md'>
          <h2 className='mb-4 text-xl font-semibold text-gray-800'>Decentralized Storage</h2>
          <p className='text-sm text-gray-500'>Upload, manage, and access your encrypted files on the Trust Chain network.</p>
          <button className='mt-4 text-sm text-blue-500 hover:underline'>Manage My Files</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
