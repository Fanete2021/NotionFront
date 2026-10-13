// eslint-disable-next-line
import type { RootState } from '@/app/store';

export const selectActiveProjectId = (state: RootState) =>
  state.calendarFilters?.activeProjectId ?? null;
