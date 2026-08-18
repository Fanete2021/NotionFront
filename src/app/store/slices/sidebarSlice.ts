import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadCurrentWorkspace } from '@/shared/utils/localStorage/localStorage';
import { STORAGE_KEY } from '@/shared/const/storageKeys';

export interface SidebarState {
  isSidebarOpened: boolean;
  currentWorkspaceId: string | null;
}

const initialState: SidebarState = {
  isSidebarOpened: false,
  currentWorkspaceId: loadCurrentWorkspace(),
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpened = !state.isSidebarOpened;
    },
    setCurrentWorkspace: (state, action: PayloadAction<string>) => {
      state.currentWorkspaceId = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, action.payload);
      }
    },
    clearCurrentWorkspace: (state) => {
      state.currentWorkspaceId = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
  },
});

export const { toggleSidebar, setCurrentWorkspace, clearCurrentWorkspace } = sidebarSlice.actions;
export const sidebarReducer = sidebarSlice.reducer;
