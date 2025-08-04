import React, { useState } from 'react'; // Added useState for nodeStatus
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector
import { logout, RootState, AppDispatch } from '../../redux'; // Import RootState and AppDispatch
import { ConnectWalletButton } from '../../components'; // Import ConnectWalletButton

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get user from Redux auth slice
  // const user = useSelector((state: RootState) => state.auth.user);
  const user = 'Ahmed';

  // Use useState for nodeStatus as it's dynamic
  const [nodeStatus, setNodeStatus] = useState<'Active' | 'Not Active' | 'Pending' | 'Offline'>('Not Active');

  const userName = user ? user : 'Guest';
  const walletBalance = '12,345.67 NEXER'; // This will be your Trust Chain specific token balance eventually

  const handleBecomeNode = () => {
    alert('Simulating "Become a Node" process...');
    console.log('User initiated "Become a Node".');
    // In a real app, this would likely trigger a flow
    // that could change nodeStatus, e.g., setNodeStatus("Pending");
  };

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
  };

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      {/* Header */}
      <header className='flex justify-between items-center mb-8 pb-4 border-b border-gray-300'>
        <h1 className='text-3xl font-bold text-gray-900'>Welcome, {userName}!</h1>
        <div className='flex items-center space-x-4'>
          {' '}
          {/* Container for buttons */}
          <ConnectWalletButton /> {/* Integrate the new button here */}
          <Button onClick={handleLogout} className='bg-red-500 hover:bg-red-700'>
            Logout
          </Button>
        </div>
      </header>

      {/* Dashboard Content Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Wallet Balance Card (for Trust Chain specific token) */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Trust Chain Wallet Balance</h2>
          <p className='text-4xl font-bold text-blue-600 mb-2'>{walletBalance}</p>
          <p className='text-sm text-gray-500'>Your current NEXER Coin balance on Trust Chain</p>
          <button className='mt-4 text-blue-500 hover:underline text-sm'>View Trust Chain Transaction History</button>
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
