import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storage } from '@shared/lib/storage';
import { STORAGE_KEYS } from '@shared/const/storageKeys';

export interface CurrentWorkspaceState {
  id: string | null;
}

const getInitialState = (): CurrentWorkspaceState => ({
  id: storage.get<string>(STORAGE_KEYS.CURRENT_WORKSPACE),
});

const currentWorkspaceSlice = createSlice({
  name: 'currentWorkspace',
  initialState: getInitialState(),
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
      storage.set(STORAGE_KEYS.CURRENT_WORKSPACE, action.payload);
    },
    clearCurrentWorkspace: (state) => {
      state.id = null;
      storage.remove(STORAGE_KEYS.CURRENT_WORKSPACE);
    },
  },
});

export const { setCurrentWorkspace, clearCurrentWorkspace } = currentWorkspaceSlice.actions;
export const currentWorkspaceReducer = currentWorkspaceSlice.reducer;
