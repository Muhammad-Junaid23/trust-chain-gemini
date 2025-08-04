import React, { useState, useEffect } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import AuthLayout from '../../layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';

// Import Redux hooks and actions/selectors
import { useDispatch, useSelector } from 'react-redux';
import { login, RootState, AppDispatch } from '../../redux'; // Assuming you added index.ts barrel export in redux

// No props needed for LoginPage anymore
const LoginPage: React.FC = () => {
  const [walletKey, setWalletKey] = useState<string>('');
  const [connectMessage, setConnectMessage] = useState<string | null>(null);

  /**
   * @concept useDispatch
   * A React Hook that returns a reference to the `dispatch` function from the Redux store.
   * You use it to dispatch actions to update the store's state.
   */
  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch for strong typing

  /**
   * @concept useSelector
   * A React Hook that allows you to extract data from the Redux store state,
   * using a selector function. It automatically subscribes to the store,
   * and will re-render your component if the selected state changes.
   */
  const { isLoggedIn, isLoading, error } = useSelector((state: RootState) => state.auth);
  // We're destructuring isLoggedIn, isLoading, and error directly from the auth slice state.

  const navigate = useNavigate();

  // Redirect if already logged in (now based on Redux state)
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Watch for errors from the Redux state
  useEffect(() => {
    if (error) {
      setConnectMessage(null); // Clear success message if error occurs
    }
  }, [error]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnectMessage(null);
    // error state is now managed by Redux, so no local setError needed for API errors.

    // Dispatch the login thunk
    const resultAction = await dispatch(login(walletKey));

    // Check if the login was successful (fulfilled) or rejected
    if (login.fulfilled.match(resultAction)) {
      setConnectMessage('✅ Wallet connection successful!');
      setWalletKey(''); // Clear input on success
      // Redirection happens in useEffect
    } else if (login.rejected.match(resultAction)) {
      // Error message is already in Redux state (error)
      // No need to set local error message directly from here
      setConnectMessage(null);
    }
  };

  return (
    <AuthLayout>
      <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Connect Your Wallet</h2>
      <p className='text-sm text-gray-600 text-center mb-6'>
        Enter your wallet private key or a relevant identifier to connect to the Trust Chain network.
      </p>
      <form onSubmit={handleLogin}>
        <InputField
          label='Wallet Key / Identifier'
          id='walletKey'
          type='password'
          value={walletKey}
          onChange={(e) => setWalletKey(e.target.value)}
          placeholder='Enter your private key or identifier'
          required
        />

        {error && ( // Display error from Redux state
          <p className='text-red-500 text-sm mb-4 text-center'>{error}</p>
        )}

        {connectMessage && <p className='text-green-600 text-sm mb-4 text-center'>{connectMessage}</p>}

        <Button
          type='submit'
          className='w-full'
          disabled={isLoading} // Disable if Redux is handling login
          onClick={() => {}}
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </form>
      <p className='text-center text-gray-500 text-xs mt-4'>
        Note: Direct private key input in a browser is for *testing purposes only*. In production, secure methods like MetaMask or
        backend-managed keys will be used.
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
