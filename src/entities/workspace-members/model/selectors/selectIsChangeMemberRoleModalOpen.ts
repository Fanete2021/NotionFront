// eslint-disable-next-line
import type { RootState } from '@/app/store';

export const selectIsChangeMemberRoleModalOpen = (state: RootState) =>
  state.changeMemberRole?.isModalOpen ?? false;
