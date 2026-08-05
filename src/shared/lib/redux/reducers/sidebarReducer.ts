import { createSlice } from '@reduxjs/toolkit';

// Базовый пример работы с Redux

type SidebarState = {
  isSidebarOpened: boolean;
};

const inititalState: SidebarState = {
  isSidebarOpened: false,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: inititalState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpened = !state.isSidebarOpened;
    },
  },
});

export const openSidebar = sidebarSlice.actions.toggleSidebar;

export const sidebarReducer = sidebarSlice.reducer;
