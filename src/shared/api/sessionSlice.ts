import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SessionSliceState = {
  status: 'unknown' | 'authenticated' | 'anonymous';

  accessToken: string | null;
};

const initialState: SessionSliceState = {
  status: 'unknown',
  accessToken: null,
};

const sessionSlice = createSlice({
  name: 'session',
  reducerPath: 'session',
  initialState,

  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.status = 'authenticated';
    },

    loggedOut(state) {
      state.accessToken = null;
      state.status = 'anonymous';
    },
  },

  selectors: {
    selectAccessToken: (state) => state.accessToken,
  },
});

export const sessionReducer = sessionSlice.reducer;

export const { setAccessToken, loggedOut } = sessionSlice.actions;

export const { selectAccessToken } = sessionSlice.selectors;
