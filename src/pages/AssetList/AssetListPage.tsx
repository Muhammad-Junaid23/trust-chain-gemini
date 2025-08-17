import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, fetchAssets } from '../../redux';
import { Link } from 'react-router-dom';
import { NavMenu } from '../../components';

const AssetListPage: React.FC = () => {
  // Get dispatch and state from Redux
  const dispatch = useDispatch<AppDispatch>();
  const { assets, isLoading, error } = useSelector((state: RootState) => state.assets);

  // Fetch assets when the component mounts
  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  // Handler to refresh the asset list
  const handleRefresh = () => {
    dispatch(fetchAssets());
  };

  return (
    <div className='container px-4 py-8 mx-auto'>
      <NavMenu />
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Asset List</h1>
        <button
          onClick={handleRefresh}
          className='py-2 px-4 rounded-lg text-white font-semibold transition-colors bg-blue-600 hover:bg-blue-700 !w-auto'
        >
          Refresh List
        </button>
      </div>
      <div className='p-6 bg-white rounded-lg shadow-md'>
        {isLoading && <p className='text-center text-blue-600'>Loading assets...</p>}
        {error && <p className='text-center text-red-500'>{error}</p>}
        {!isLoading && !error && assets.length === 0 && (
          <p className='text-center text-gray-500'>No assets found. Create one to get started!</p>
        )}
        {!isLoading && assets.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default AssetListPage;
