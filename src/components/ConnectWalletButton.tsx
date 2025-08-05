import React, { useEffect } from 'react';
import Button from './Button';
import { useDispatch, useSelector } from 'react-redux';
import {
  connectMetaMask,
  disconnectWallet,
  clearWalletError,
  RootState,
  AppDispatch,
  fetchBalance,
  updateWalletAccount,
  updateWalletChain,
} from '../redux';

const ConnectWalletButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isConnected, accountAddress, chainId, balance, isLoading, error } = useSelector((state: RootState) => state.wallet);

  const shortAddress = accountAddress ? `${accountAddress.substring(0, 6)}...${accountAddress.substring(accountAddress.length - 4)}` : '';

  // 1. New useEffect to handle initial hydration and balance fetch
  useEffect(() => {
    // If the state is connected but the balance is null, fetch it
    if (isConnected && accountAddress && !balance && !isLoading) {
      dispatch(fetchBalance(accountAddress));
    }
  }, [isConnected, accountAddress, balance, isLoading, dispatch]);

  // 2. Existing useEffect to listen for MetaMask events
  useEffect(() => {
    if ((window as any).ethereum && isConnected) {
      const ethereum = (window as any).ethereum;

      const handleAccountsChanged = (accounts: string[]) => {
        console.log('MetaMask accounts changed:', accounts);
        if (accounts.length === 0) {
          dispatch(disconnectWallet());
        } else if (accountAddress !== accounts[0]) {
          dispatch(updateWalletAccount(accounts[0]));
          dispatch(fetchBalance(accounts[0]));
        }
      };

      const handleChainChanged = (newChainId: string) => {
        console.log('MetaMask chain changed:', newChainId);
        dispatch(updateWalletChain(newChainId));
        if (accountAddress) {
          dispatch(fetchBalance(accountAddress));
        }
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [isConnected, accountAddress, dispatch]);

  const handleConnect = () => {
    dispatch(clearWalletError());
    dispatch(connectMetaMask());
  };

  const handleDisconnect = () => {
    dispatch(disconnectWallet());
  };

  return (
    <div className='flex items-center space-x-2'>
      {isConnected ? (
        <div className='flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm'>
          <span className='relative flex h-2 w-2 mr-2'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
          </span>
          <span>Connected: {shortAddress}</span>
          {/* Show a loading state for the balance if it's not yet fetched */}
          {balance ? <span className='ml-2'>({parseFloat(balance).toFixed(4)} ETH)</span> : <span className='ml-2'>(...)</span>}
          <Button
            onClick={handleDisconnect}
            className='ml-4 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-full'
            disabled={isLoading}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium'
          disabled={isLoading}
        >
          {isLoading ? 'Connecting Wallet...' : 'Connect Wallet'}
        </Button>
      )}
      {error && <p className='text-red-500 text-sm ml-4'>{error}</p>}
    </div>
  );
};

export default ConnectWalletButton;
