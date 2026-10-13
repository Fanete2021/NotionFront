import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DayPanelFiltersState {
  selectedProjectIds: string[];
  isOpen: boolean;
}

const initialState: DayPanelFiltersState = {
  selectedProjectIds: [],
  isOpen: false,
};

const dayPanelFiltersSlice = createSlice({
  name: 'dayPanelFilters',
  initialState,
  reducers: {
    toggleDayPanelFilter: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.selectedProjectIds = state.selectedProjectIds.includes(id)
        ? state.selectedProjectIds.filter((x) => x !== id)
        : [...state.selectedProjectIds, id];
    },

    clearDayPanelFilters: (state) => {
      state.selectedProjectIds = [];
    },

    setDayPanelFiltersOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { toggleDayPanelFilter, clearDayPanelFilters, setDayPanelFiltersOpen } =
  dayPanelFiltersSlice.actions;

export const dayPanelFiltersReducer = dayPanelFiltersSlice.reducer;
