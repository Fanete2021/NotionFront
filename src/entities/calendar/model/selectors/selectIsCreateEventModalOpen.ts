// eslint-disable-next-line
import { RootState } from '@/app/store';

export const selectIsCreateEventModalOpen = (state: RootState) =>
  state.createEventModal?.isCreateEventModalOpen ?? false;

export const selectEditingEvent = (state: RootState) => state.createEventModal?.event ?? null;
