import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the user and the overall authentication state
interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

// Interface for storing temporary signup credentials to make the login work
interface SignupCredentials {
  email: string;
  password: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

// Check for stored user and token on initial load
try {
  const storedUser = localStorage.getItem('trustChainUser');
  const storedToken = localStorage.getItem('trustChainToken');
  if (storedUser && storedToken) {
    initialState.user = JSON.parse(storedUser);
    initialState.token = storedToken;
    initialState.isLoggedIn = true;
  }
} catch (e) {
  console.error('Failed to parse stored user or token from localStorage:', e);
  localStorage.removeItem('trustChainUser');
  localStorage.removeItem('trustChainToken');
}

// Thunk for user signup
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate an API call to a backend /signup endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store the new credentials in localStorage to be used by the login thunk
      localStorage.setItem('trustChainSignupCredentials', JSON.stringify({ email, password }));

      const dummyUser: User = { id: 'user-' + Date.now(), email };
      const dummyToken = `dummy-jwt-token-for-${email}`;

      localStorage.setItem('trustChainUser', JSON.stringify(dummyUser));
      localStorage.setItem('trustChainToken', dummyToken);

      return { user: dummyUser, token: dummyToken };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

// Thunk for user login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate an API call to a backend /login endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // --- FIX: Use a more flexible validation logic ---
      let isAuthenticated = false;
      let userDetails: User | null = null;
      let token: string | null = null;

      // 1. Check against the hardcoded test user
      if (email === 'test@example.com' && password === 'password123') {
        isAuthenticated = true;
        userDetails = { id: 'user-001', email: 'test@example.com' };
        token = 'dummy-jwt-token-for-test@example.com';
      }

      // 2. Or, check against the last signed-up user's credentials from localStorage
      const storedCredentials = localStorage.getItem('trustChainSignupCredentials');
      if (storedCredentials) {
        const { email: storedEmail, password: storedPassword }: SignupCredentials = JSON.parse(storedCredentials);
        if (email === storedEmail && password === storedPassword) {
          isAuthenticated = true;
          userDetails = { id: 'user-' + storedEmail, email: storedEmail };
          token = `dummy-jwt-token-for-${storedEmail}`;
        }
      }

      // If neither condition is met, fail the login
      if (!isAuthenticated || !userDetails || !token) {
        throw new Error('Invalid email or password.');
      }
      // --- END FIX ---

      localStorage.setItem('trustChainUser', JSON.stringify(userDetails));
      localStorage.setItem('trustChainToken', token);

      return { user: userDetails, token };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Slice definition
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.error = null;
      localStorage.removeItem('trustChainUser');
      localStorage.removeItem('trustChainToken');
      // OPTIONAL: Clear signup credentials on logout if you want
      // localStorage.removeItem('trustChainSignupCredentials');
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login thunk lifecycle
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.error = (action.payload as string) || 'Authentication failed';
      })
      // Handle signup thunk lifecycle
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.error = (action.payload as string) || 'Signup failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
