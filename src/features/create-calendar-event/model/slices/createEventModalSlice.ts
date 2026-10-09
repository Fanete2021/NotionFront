import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalendarEvent } from '@/entities/calendar';

export interface CreateEventModalState {
  isCreateEventModalOpen: boolean;
  event: CalendarEvent | null;
}

const initialState: CreateEventModalState = {
  isCreateEventModalOpen: false,
  event: null,
};

const createEventModalSlice = createSlice({
  name: 'createEventSlice',
  initialState,
  reducers: {
    openCreateEventModal: (state) => {
      state.isCreateEventModalOpen = true;
      state.event = null;
    },

    openEditEventModal: (state, action: PayloadAction<CalendarEvent>) => {
      state.isCreateEventModalOpen = true;
      state.event = action.payload;
    },

    closeCreateEventModal: (state) => {
      state.isCreateEventModalOpen = false;
      state.event = null;
    },
  },
});

export const { openCreateEventModal, openEditEventModal, closeCreateEventModal } =
  createEventModalSlice.actions;

export const createEventModalReducer = createEventModalSlice.reducer;
