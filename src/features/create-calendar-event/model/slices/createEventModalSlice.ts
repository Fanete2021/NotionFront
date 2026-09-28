import { createSlice } from '@reduxjs/toolkit';

export interface CreateEventModalState {
  isCreateEventModalOpen: boolean;
}

const initialState: CreateEventModalState = {
  isCreateEventModalOpen: false,
};

const createEventModalSlice = createSlice({
  name: 'createEventSlice',
  initialState,
  reducers: {
    openCreateEventModal: (state) => {
      state.isCreateEventModalOpen = true;
    },
    closeCreateEventModal: (state) => {
      state.isCreateEventModalOpen = false;
    },
  },
});

export const { openCreateEventModal, closeCreateEventModal } = createEventModalSlice.actions;

export const createEventModalReducer = createEventModalSlice.reducer;
