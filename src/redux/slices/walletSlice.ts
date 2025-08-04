import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers'; // Import ethers.js

// 1. Define the shape of your wallet state
interface WalletState {
  isConnected: boolean;
  accountAddress: string | null;
  chainId: string | null; // e.g., '0x1' for Mainnet, '0x3' for Ropsten
  balance: string | null; // Balance in ETH (or native currency of the chain)
  isLoading: boolean; // For tracking MetaMask connection process
  error: string | null; // For storing MetaMask connection errors
}

// 2. Define the initial state for the wallet slice
const initialState: WalletState = {
  isConnected: false,
  accountAddress: null,
  chainId: null,
  balance: null,
  isLoading: false,
  error: null,
};

// Check for existing connection or update on account/chain change
// This will be handled by listening to window.ethereum events in a useEffect later,
// but for initial hydration, we can't reliably know the connection status this way.
// It's better to assume disconnected and let the user connect.

/**
 * @concept createAsyncThunk for connecting to MetaMask
 * This thunk will handle the asynchronous process of connecting to MetaMask.
 */
export const connectMetaMask = createAsyncThunk('wallet/connectMetaMask', async (_, { rejectWithValue, dispatch }) => {
  try {
    // Check if MetaMask is installed
    if (!(window as any).ethereum) {
      throw new Error('MetaMask is not installed. Please install it to connect your wallet.');
    }

    // Request account access
    // This will open MetaMask and ask the user to connect
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

    if (accounts.length === 0) {
      throw new Error('No accounts connected.');
    }

    const account = accounts[0];

    // Get chainId
    const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });

    // Get balance using ethers.js
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const balanceWei = await provider.getBalance(account);
    const balanceEth = ethers.formatEther(balanceWei); // Convert Wei to Ether

    // Set up event listeners for accountsChanged and chainChanged
    // These will dispatch actions to keep Redux state in sync
    (window as any).ethereum.on('accountsChanged', (newAccounts: string[]) => {
      if (newAccounts.length === 0) {
        dispatch(disconnectWallet()); // User disconnected all accounts
      } else {
        // Dispatch an action to update account and balance
        dispatch(updateWalletAccount(newAccounts[0]));
      }
    });

    (window as any).ethereum.on('chainChanged', (newChainId: string) => {
      // Dispatch an action to update chain ID and potentially re-fetch balance
      dispatch(updateWalletChain(newChainId));
    });

    return {
      accountAddress: account,
      chainId: chainId,
      balance: balanceEth,
    };
  } catch (error: any) {
    console.error('MetaMask connection failed:', error);
    // Handle specific MetaMask errors more gracefully if needed
    if (error.code === 4001) {
      // User rejected the request
      return rejectWithValue('Wallet connection rejected by the user.');
    }
    return rejectWithValue(error.message || 'Failed to connect to MetaMask.');
  }
});

/**
 * @concept createAsyncThunk for getting balance (can be called separately if needed)
 */
export const fetchBalance = createAsyncThunk('wallet/fetchBalance', async (accountAddress: string, { rejectWithValue }) => {
  try {
    if (!(window as any).ethereum) {
      throw new Error('MetaMask is not installed.');
    }
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const balanceWei = await provider.getBalance(accountAddress);
    return ethers.formatEther(balanceWei); // Convert Wei to Ether
  } catch (error: any) {
    console.error('Failed to fetch balance:', error);
    return rejectWithValue(error.message || 'Failed to fetch balance.');
  }
});

// 3. Create the wallet slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    // Synchronous action to disconnect wallet
    disconnectWallet: (state) => {
      state.isConnected = false;
      state.accountAddress = null;
      state.chainId = null;
      state.balance = null;
      state.error = null;
      // You might also want to remove event listeners here if they were added dynamically,
      // but for now, we're adding them once on initial connect.
    },
    // Synchronous action to update account if changed via MetaMask directly
    updateWalletAccount: (state, action: PayloadAction<string>) => {
      state.accountAddress = action.payload;
      // When account changes, we typically need to re-fetch balance
      // Dispatching fetchBalance thunk for this should happen from the component or a middleware
      // For simplicity, we just update the address here. Balance will be fetched separately.
    },
    // Synchronous action to update chain ID if changed via MetaMask directly
    updateWalletChain: (state, action: PayloadAction<string>) => {
      state.chainId = action.payload;
      state.balance = null; // Clear balance, it needs to be refetched for new chain
      // Again, fetchBalance thunk should be dispatched from where this action is consumed.
    },
    // Action to clear wallet errors manually
    clearWalletError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- connectMetaMask Thunk Cases ---
      .addCase(connectMetaMask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(connectMetaMask.fulfilled, (state, action: PayloadAction<{ accountAddress: string; chainId: string; balance: string }>) => {
        state.isLoading = false;
        state.isConnected = true;
        state.accountAddress = action.payload.accountAddress;
        state.chainId = action.payload.chainId;
        state.balance = action.payload.balance;
        state.error = null;
      })
      .addCase(connectMetaMask.rejected, (state, action) => {
        state.isLoading = false;
        state.isConnected = false;
        state.accountAddress = null;
        state.chainId = null;
        state.balance = null;
        state.error = (action.payload as string) || 'Failed to connect to wallet.';
      })
      // --- fetchBalance Thunk Cases ---
      .addCase(fetchBalance.fulfilled, (state, action: PayloadAction<string>) => {
        state.balance = action.payload;
        state.error = null; // Clear error if balance fetch succeeds
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        // Only update balance error, keep other connection status
        state.balance = null;
        state.error = (action.payload as string) || 'Failed to refresh balance.';
      });
  },
});

export const { disconnectWallet, updateWalletAccount, updateWalletChain, clearWalletError } = walletSlice.actions;
export default walletSlice.reducer;
