// eslint-disable-next-line
import type { RootState } from '@/app/store';

export const selectDayPanelProjectIds = (state: RootState) =>
  state.dayPanelFilters?.selectedProjectIds ?? [];

export const selectDayPanelFiltersOpen = (state: RootState) =>
  state.dayPanelFilters?.isOpen ?? false;
