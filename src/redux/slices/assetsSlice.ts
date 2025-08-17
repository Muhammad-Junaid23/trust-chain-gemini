import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// =============================================================
// INTERFACES & TYPE DEFINITIONS
// =============================================================

// Define the shape of an Asset, which will be stored in our state.
export interface Asset {
  id: string;
  name: string;
  value: number; // Value in a common currency or token unit (e.g., ETH)
}

// Define the shape of the entire Assets state slice.
export interface AssetsState {
  assets: Asset[];
  isLoading: boolean;
  error: string | null;
}

// Set the initial state for the assets slice.
const initialState: AssetsState = {
  assets: [],
  isLoading: false,
  error: null,
};

// =============================================================
// MOCK API SERVICE
// This is a dummy backend to simulate asynchronous data fetching.
// In a real application, this would be a real API call.
// =============================================================

const DUMMY_ASSETS: Asset[] = [
  { id: 'ASSET-001', name: 'Trust Token', value: 100 },
  { id: 'ASSET-002', name: 'Chain Coin', value: 250 },
  { id: 'ASSET-003', name: 'Digital Ledger', value: 50 },
];

const mockBackend = {
  /**
   * Fetches all assets from the "backend" asynchronously.
   * Simulates network latency with a setTimeout.
   */
  getAssets: () =>
    new Promise<Asset[]>((resolve) => {
      console.log('Mock API: Fetching assets...');
      setTimeout(() => {
        resolve([...DUMMY_ASSETS]); // Return a copy to prevent mutation issues
      }, 1000);
    }),
  /**
   * Submits a new asset to the "backend".
   * Simulates a successful API response with a unique ID.
   */
  submitAsset: (newAsset: Omit<Asset, 'id'>) =>
    new Promise<Asset>((resolve, reject) => {
      console.log('Mock API: Submitting new asset...');
      setTimeout(() => {
        if (!newAsset.name || !newAsset.value) {
          reject('Invalid asset data');
          return;
        }
        // Create a new asset with a unique, mock ID
        const createdAsset = { ...newAsset, id: `ASSET-${Math.floor(Math.random() * 1000)}` };
        console.log('API log: Successful submission!', createdAsset);
        // Push to our dummy data array to simulate persistence.
        DUMMY_ASSETS.push(createdAsset);
        resolve(createdAsset);
      }, 1500);
    }),
};

// =============================================================
// ASYNC THUNKS
// These actions handle the asynchronous logic with Redux.
// =============================================================

/**
 * Thunk to fetch assets from the mock backend.
 * Dispatches 'pending', 'fulfilled', and 'rejected' actions.
 */
export const fetchAssets = createAsyncThunk('assets/fetchAssets', async (_, { rejectWithValue }) => {
  try {
    const assets = await mockBackend.getAssets();
    return assets;
  } catch (error) {
    return rejectWithValue('Failed to fetch assets.');
  }
});

/**
 * Thunk to create a new asset by submitting to the mock backend.
 */
export const createAsset = createAsyncThunk('assets/createAsset', async (assetData: Omit<Asset, 'id'>, { rejectWithValue }) => {
  try {
    const newAsset = await mockBackend.submitAsset(assetData);
    return newAsset;
  } catch (error) {
    return rejectWithValue('Failed to submit asset.');
  }
});

// =============================================================
// ASSETS SLICE
// =============================================================

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {}, // No synchronous reducers needed for now
  extraReducers: (builder) => {
    builder
      // Handle the lifecycle of the fetchAssets thunk
      .addCase(fetchAssets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action: PayloadAction<Asset[]>) => {
        state.isLoading = false;
        state.assets = action.payload;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Handle the lifecycle of the createAsset thunk
      .addCase(createAsset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAsset.fulfilled, (state, action: PayloadAction<Asset>) => {
        state.isLoading = false;
        state.assets.push(action.payload);
      })
      .addCase(createAsset.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the reducer so it can be combined in the store
export default assetsSlice.reducer;
