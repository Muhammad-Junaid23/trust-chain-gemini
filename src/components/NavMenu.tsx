import React from 'react';
import { Link } from 'react-router-dom';

const NavMenu: React.FC = () => {
  return (
    <nav className='p-4 mb-4 bg-gray-800 shadow-md ps-12'>
      <ul className='flex justify-start space-x-6 text-white'>
        <li>
          <Link to='/home' className='transition-colors hover:text-gray-300'>
            Home
          </Link>
        </li>
        <li>
          <Link to='/assets' className='transition-colors hover:text-gray-300'>
            Asset List
          </Link>
        </li>
        <li>
          <Link to='/create-asset' className='transition-colors hover:text-gray-300'>
            Create Asset
          </Link>
        </li>
        <li>
          <Link to='/admin' className='transition-colors hover:text-gray-300'>
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavMenu;
