// eslint-disable-next-line
import { RootState } from '@/app/store';

export const selectCreateInviteLinkWorkspaceId = (state: RootState) =>
  state.inviteLinkModal?.createInviteLinkWorkspaceId ?? null;
