import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthSliceState = {
  authState: 'authorized' | 'unauthorized';
  accessToken: string | null;
};

const initialState: AuthSliceState = {
  authState: 'unauthorized',
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.authState = 'authorized';
    },

    loggedOut(state) {
      state.accessToken = null;
      state.authState = 'unauthorized';
    },
  },
});

export const authReducer = authSlice.reducer;

export const setAccessToken = authSlice.actions.setAccessToken;

export const loggedOut = authSlice.actions.loggedOut;
