import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector
import { RootState } from '../redux'; // Import RootState

interface PrivateRouteProps {
  // Add roles or permissions here if needed later
}

const PrivateRoute: React.FC<PrivateRouteProps> = (
  {
    /* allowedRoles */
  }
) => {
  // Select isLoggedIn and isLoading from the Redux auth slice state
  const { isLoggedIn, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    // Show a loading indicator while auth status is being determined (e.g., from localStorage)
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <p className='text-xl text-gray-700'>Loading authentication status...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    // If not logged in, redirect to the login page
    return <Navigate to='/' replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default PrivateRoute;
