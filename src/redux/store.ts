import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // We'll create this next

/**
 * @concept Redux Store
 * This is the central brain of your Redux application.
 * It holds the complete state tree of your app.
 * `configureStore` is an RTK helper that simplifies store setup.
 * It automatically sets up Redux DevTools, `redux-thunk` middleware,
 * and combines your reducers.
 */
export const store = configureStore({
  reducer: {
    // Each key here represents a slice of your global state.
    // authReducer will manage all state related to authentication.
    auth: authReducer,
    // Add other reducers here as your app grows:
    // wallet: walletReducer,
    // node: nodeReducer,
    // transactions: transactionsReducer,
  },
  // You can add middleware here if needed, but configureStore adds sensible defaults.
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// These are useful for strong typing your useSelector and useDispatch hooks in TypeScript.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;