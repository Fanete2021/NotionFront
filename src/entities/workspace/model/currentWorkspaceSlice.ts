import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadCurrentWorkspace } from '@/shared/utils/localStorage/localStorage';
import { STORAGE_KEY } from '@/shared/const/storageKeys';

export interface CurrentWorkspaceState {
  id: string | null;
}

const initialState: CurrentWorkspaceState = {
  id: loadCurrentWorkspace(),
};

const currentWorkspaceSlice = createSlice({
  name: 'currentWorkspace',
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, action.payload);
      }
    },
    clearCurrentWorkspace: (state) => {
      state.id = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
  },
});

export const { setCurrentWorkspace, clearCurrentWorkspace } = currentWorkspaceSlice.actions;
export const currentWorkspaceReducer = currentWorkspaceSlice.reducer;
