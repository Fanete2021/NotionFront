import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthSliceState = {
  authState: 'unknown' | 'authorized' | 'unauthorized';

  accessToken: string | null;
};

const initialState: AuthSliceState = {
  authState: 'unknown',
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

export const selectAccessToken = (state: AuthSliceState) => state.accessToken;
