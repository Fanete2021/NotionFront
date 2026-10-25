// eslint-disable-next-line
import type { RootState } from '@/app/store';

export const selectChoosedMember = (state: RootState) => state.changeMemberRole?.member ?? null;
