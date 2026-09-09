import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CurrentWorkspaceState {
  id: string | null;
}

const initialState: CurrentWorkspaceState = {
  id: null,
};

const currentWorkspaceSlice = createSlice({
  name: 'currentWorkspace',
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    clearCurrentWorkspace: (state) => {
      state.id = null;
    },
  },
});

export const { setCurrentWorkspace, clearCurrentWorkspace } = currentWorkspaceSlice.actions;
export const currentWorkspaceReducer = currentWorkspaceSlice.reducer;
