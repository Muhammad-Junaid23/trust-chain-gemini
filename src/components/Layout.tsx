import React from 'react';
import { Outlet } from 'react-router-dom';
import NavMenu from './NavMenu';

const Layout: React.FC = () => {
  return (
    <div className='min-h-screen font-sans bg-gray-100'>
      <NavMenu />
      <div className='container mx-auto'>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
