import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import AuthLayout from '../../layouts/AuthLayout';

// Add the onLoginSuccess prop interface
interface LoginPageProps {
  onLoginSuccess: () => void;
}

// Update the component's type to accept the prop
const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [walletKey, setWalletKey] = useState<string>('');
  const [connectMessage, setConnectMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setConnectMessage(null);
    setError(null);

    try {
      if (walletKey.trim() === '') {
        throw new Error('Wallet key cannot be empty.');
      }
      if (walletKey.length < 10) {
        throw new Error('Invalid wallet key length.');
      }

      console.log('Attempting to connect with wallet key:', walletKey);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setConnectMessage('✅ Wallet connection successful! Redirecting...');
      setWalletKey(''); // Clear input on success

      // Call the success callback passed from App.tsx
      onLoginSuccess();
    } catch (err: any) {
      setError(`❌ Connection failed: ${err.message || 'An unknown error occurred.'}`);
      setConnectMessage(null);
    } finally {
      setIsLoading(false);
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

        {error && <p className='text-red-500 text-sm mb-4 text-center'>{error}</p>}

        {connectMessage && <p className='text-green-600 text-sm mb-4 text-center'>{connectMessage}</p>}

        <Button
          type='submit'
          className='w-full'
          disabled={isLoading}
          onClick={() => {}} // Still needed for type definition, actual submit via form
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
