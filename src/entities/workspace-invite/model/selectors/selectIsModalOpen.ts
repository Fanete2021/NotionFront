// eslint-disable-next-line
import { RootState } from '@/app/store';

export const selectIsModalOpen = (state: RootState) =>
  state.inviteLinkModal?.isInviteLinkModalOpen ?? false;
