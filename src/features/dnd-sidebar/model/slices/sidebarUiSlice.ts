import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SidebarUiState {
  openGroupIds: string[];
}

const initialState: SidebarUiState = {
  openGroupIds: [],
};

const sidebarUiSlice = createSlice({
  name: 'sidebarUi',
  initialState,
  reducers: {
    toggleGroup: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.openGroupIds.includes(id)) {
        state.openGroupIds = state.openGroupIds.filter((x) => x !== id);
      } else {
        state.openGroupIds.push(id);
      }
    },
    closeAllGroups: (state) => {
      state.openGroupIds = [];
    },
  },
});

export const { toggleGroup, closeAllGroups } = sidebarUiSlice.actions;
export const sidebarUiReducer = sidebarUiSlice.reducer;
