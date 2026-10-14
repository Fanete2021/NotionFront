import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CalendarFiltersState {
  activeProjectId: string | null;
}

const initialState: CalendarFiltersState = {
  activeProjectId: null,
};

const calendarFiltersSlice = createSlice({
  name: 'calendarFilters',
  initialState,
  reducers: {
    setActiveProjectId: (state, action: PayloadAction<string | null>) => {
      state.activeProjectId = action.payload;
    },
    resetCalendarFilters: () => initialState,
  },
});

export const { setActiveProjectId, resetCalendarFilters } = calendarFiltersSlice.actions;

export const calendarFiltersReducer = calendarFiltersSlice.reducer;
