import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { RootState, AppDispatch, createAsset } from '../../redux';
import { NavMenu } from '../../components';

const CreateAssetPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.assets);

  const [name, setName] = useState('');
  const [value, setValue] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && value !== '') {
      await dispatch(createAsset({ name, value: Number(value) }));
      // Navigate to the asset list page after a successful submission
      navigate('/assets');
    }
  };

  return (
    <div className='container px-4 py-8 mx-auto'>
      <NavMenu />
      <h1 className='mb-6 text-3xl font-bold text-gray-800'>Create New Asset</h1>
      <div className='p-6 bg-white rounded-lg shadow-md'>
        <form onSubmit={handleSubmit}>
          <div className='mb-4 '>
            <label htmlFor='asset-name' className='block mb-2 text-sm font-medium text-gray-700'>
              Asset Name
            </label>
            <input
              id='asset-name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g., Trust Token'
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div className='mt-4 mb-4'>
            <label htmlFor='asset-value' className='block mb-2 text-sm font-medium text-gray-700'>
              Asset Value (ETH)
            </label>
            <input
              id='asset-value'
              type='number'
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='e.g., 100'
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          {error && <p className='my-4 text-sm text-red-500'>{error}</p>}
          <button
            type='submit'
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            {isLoading ? 'Submitting...' : 'Submit Asset'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAssetPage;
