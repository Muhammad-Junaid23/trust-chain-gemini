import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, fetchAssets } from '../../redux';

const AdminDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { assets, isLoading, error } = useSelector((state: RootState) => state.assets);

  // Fetch assets when the component mounts
  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  // Calculate dashboard stats
  const totalAssets = assets.length;
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  // Safely get the latest asset value, defaulting to 0 if no assets exist
  const latestAssetValue = assets.length > 0 ? assets[assets.length - 1].value : 0;

  return (
    <div className='container px-4 py-8 mx-auto'>
      <h1 className='mb-6 text-3xl font-bold text-gray-800'>Admin Dashboard</h1>
      {isLoading && <p className='text-center text-blue-600'>Loading dashboard data...</p>}
      {error && <p className='text-center text-red-500'>{error}</p>}
      {!isLoading && !error && (
        <>
          <div className='grid grid-cols-1 gap-6 mb-6 md:grid-cols-3'>
            <div className='p-6 bg-white rounded-lg shadow-md'>
              <h2 className='mb-4 text-xl font-semibold text-gray-800'>Total Assets</h2>
              <p className='text-4xl font-bold text-blue-600'>{totalAssets}</p>
            </div>
            <div className='p-6 bg-white rounded-lg shadow-md'>
              <h2 className='mb-4 text-xl font-semibold text-gray-800'>Total Value</h2>
              <p className='text-4xl font-bold text-green-600'>{totalValue} ETH</p>
            </div>
            <div className='p-6 bg-white rounded-lg shadow-md'>
              <h2 className='mb-4 text-xl font-semibold text-gray-800'>Latest Asset Value</h2>
              <p className='text-4xl font-bold text-purple-600'>{latestAssetValue} ETH</p>
            </div>
          </div>
          <div className='p-6 bg-white rounded-lg shadow-md'>
            <h2 className='mb-4 text-xl font-semibold text-gray-800'>Asset Data Table</h2>
            <div className='overflow-x-auto'>
              <table className='min-w-full bg-white rounded-lg shadow-md'>
                <thead className='bg-gray-100'>
                  <tr>
                    <th className='px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-500 uppercase rounded-tl-lg'>ID</th>
                    <th className='px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-500 uppercase'>Name</th>
                    <th className='px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-500 uppercase rounded-tr-lg'>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset, index) => (
                    <tr key={asset.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>{asset.id}</td>
                      <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>{asset.name}</td>
                      <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>{asset.value} ETH</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
