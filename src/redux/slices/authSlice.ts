import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Update the User interface to include a name property
interface User {
  id: string;
  email: string;
  name: string; // <-- NEW
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

interface SignupCredentials {
  email: string;
  password: string;
  name: string; // <-- NEW
}

const getInitialState = (): AuthState => {
  try {
    const storedUser = localStorage.getItem('trustChainUser');
    const storedToken = localStorage.getItem('trustChainToken');
    if (storedUser && storedToken) {
      const user: User = JSON.parse(storedUser);
      return {
        user,
        token: storedToken,
        isLoggedIn: true,
        isLoading: false,
        error: null,
      };
    }
  } catch (e) {
    console.error('Failed to parse stored user or token from localStorage:', e);
    localStorage.removeItem('trustChainUser');
    localStorage.removeItem('trustChainToken');
  }
  return {
    user: null,
    token: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

export const signup = createAsyncThunk('auth/signup', async ({ email, password, name }: SignupCredentials, { rejectWithValue }) => {
  // <-- NAME ADDED
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const dummyUser: User = { id: 'user-' + Date.now(), email, name }; // <-- NAME ADDED
    const dummyToken = `dummy-jwt-token-for-${email}`;

    localStorage.setItem('trustChainUser', JSON.stringify(dummyUser));
    localStorage.setItem('trustChainToken', dummyToken);
    localStorage.setItem('trustChainSignupCredentials', JSON.stringify({ email, password, name })); // <-- NAME ADDED

    return { user: dummyUser, token: dummyToken };
  } catch (error: any) {
    return rejectWithValue(error.message || 'Signup failed');
  }
});

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let isAuthenticated = false;
      let userDetails: User | null = null;
      let token: string | null = null;

      // Check against the hardcoded test user
      if (email === 'test@example.com' && password === 'password123') {
        isAuthenticated = true;
        userDetails = { id: 'user-001', email: 'test@example.com', name: 'Test User' }; // <-- NAME ADDED
        token = 'dummy-jwt-token-for-test@example.com';
      }

      // Check against the last signed-up user's credentials from localStorage
      const storedCredentials = localStorage.getItem('trustChainSignupCredentials');
      if (storedCredentials) {
        const { email: storedEmail, password: storedPassword, name: storedName }: SignupCredentials = JSON.parse(storedCredentials);
        if (email === storedEmail && password === storedPassword) {
          isAuthenticated = true;
          userDetails = { id: 'user-' + storedEmail, email: storedEmail, name: storedName }; // <-- NAME ADDED
          token = `dummy-jwt-token-for-${storedEmail}`;
        }
      }

      if (!isAuthenticated || !userDetails || !token) {
        throw new Error('Invalid email or password.');
      }

      localStorage.setItem('trustChainUser', JSON.stringify(userDetails));
      localStorage.setItem('trustChainToken', token);

      return { user: userDetails, token };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

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
