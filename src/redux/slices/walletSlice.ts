import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

interface WalletState {
  isConnected: boolean;
  accountAddress: string | null;
  chainId: string | null;
  balance: string | null;
  isLoading: boolean;
  error: string | null;
}

// 1. Initial state checks localStorage for existing data
const getInitialState = (): WalletState => {
  try {
    const storedAccount = localStorage.getItem('walletAccount');
    const storedChainId = localStorage.getItem('walletChainId');
    if (storedAccount && storedChainId) {
      return {
        isConnected: true,
        accountAddress: storedAccount,
        chainId: storedChainId,
        balance: null, // Balance should be fetched dynamically
        isLoading: false,
        error: null,
      };
    }
  } catch (e) {
    console.error('Could not load wallet state from localStorage', e);
  }
  return {
    isConnected: false,
    accountAddress: null,
    chainId: null,
    balance: null,
    isLoading: false,
    error: null,
  };
};

const initialState: WalletState = getInitialState();

export const connectMetaMask = createAsyncThunk('wallet/connectMetaMask', async (_, { rejectWithValue, dispatch }) => {
  try {
    if (!(window as any).ethereum) {
      throw new Error('MetaMask is not installed. Please install it to connect your wallet.');
    }

    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

    if (accounts.length === 0) {
      throw new Error('No accounts connected.');
    }

    const account = accounts[0];
    const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const balanceWei = await provider.getBalance(account);
    const balanceEth = ethers.formatEther(balanceWei);

    // Save connection details to localStorage on successful connection
    localStorage.setItem('walletAccount', account);
    localStorage.setItem('walletChainId', chainId);

    return {
      accountAddress: account,
      chainId: chainId,
      balance: balanceEth,
    };
  } catch (error: any) {
    console.error('MetaMask connection failed:', error);
    if (error.code === 4001) {
      return rejectWithValue('Wallet connection rejected by the user.');
    }
    return rejectWithValue(error.message || 'Failed to connect to MetaMask.');
  }
});

export const fetchBalance = createAsyncThunk('wallet/fetchBalance', async (accountAddress: string, { rejectWithValue }) => {
  try {
    if (!(window as any).ethereum) {
      throw new Error('MetaMask is not installed.');
    }
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const balanceWei = await provider.getBalance(accountAddress);
    return ethers.formatEther(balanceWei);
  } catch (error: any) {
    console.error('Failed to fetch balance:', error);
    return rejectWithValue(error.message || 'Failed to fetch balance.');
  }
});

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    disconnectWallet: (state) => {
      state.isConnected = false;
      state.accountAddress = null;
      state.chainId = null;
      state.balance = null;
      state.error = null;
      // Clear localStorage on disconnect
      localStorage.removeItem('walletAccount');
      localStorage.removeItem('walletChainId');
    },
    updateWalletAccount: (state, action: PayloadAction<string>) => {
      state.accountAddress = action.payload;
      localStorage.setItem('walletAccount', action.payload);
    },
    updateWalletChain: (state, action: PayloadAction<string>) => {
      state.chainId = action.payload;
      state.balance = null;
      localStorage.setItem('walletChainId', action.payload);
    },
    clearWalletError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
        // Clear localStorage on rejected connection to be safe
        localStorage.removeItem('walletAccount');
        localStorage.removeItem('walletChainId');
      })
      .addCase(fetchBalance.fulfilled, (state, action: PayloadAction<string>) => {
        state.balance = action.payload;
        state.error = null;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.balance = null;
        state.error = (action.payload as string) || 'Failed to refresh balance.';
      });
  },
});

export const { disconnectWallet, updateWalletAccount, updateWalletChain, clearWalletError } = walletSlice.actions;
export default walletSlice.reducer;
