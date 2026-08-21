import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadAccessToken, saveAccessToken, removeAccessToken } from '@/shared/utils/localStorage';

export type SessionSliceState = {
  status: 'unknown' | 'authenticated' | 'anonymous';
  accessToken: string | null;
};

const initialState: SessionSliceState = {
  status: 'unknown',
  accessToken: loadAccessToken(),
};

const sessionSlice = createSlice({
  name: 'session',
  reducerPath: 'session',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.status = 'authenticated';
      saveAccessToken(action.payload);
    },
    loggedOut(state) {
      state.accessToken = null;
      state.status = 'anonymous';
      removeAccessToken();
    },
  },
  selectors: {
    selectAccessToken: (state) => state.accessToken,
    selectSessionStatus: (state) => state.status,
  },
});

export const { setAccessToken, loggedOut } = sessionSlice.actions;
export const { selectAccessToken, selectSessionStatus } = sessionSlice.selectors;
export const sessionReducer = sessionSlice.reducer;
