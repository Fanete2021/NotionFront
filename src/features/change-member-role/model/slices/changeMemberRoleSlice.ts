import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkspaceMember } from '@/entities/workspace-members';

export interface ChangeMemberRoleState {
  isModalOpen: boolean;
  member: WorkspaceMember | null;
}

const initialState: ChangeMemberRoleState = {
  isModalOpen: false,
  member: null,
};

export const changeMemberRoleSlice = createSlice({
  name: 'memberRole',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<WorkspaceMember>) {
      state.isModalOpen = true;
      state.member = action.payload;
    },

    closeModal(state) {
      state.isModalOpen = false;
      state.member = null;
    },
  },
});

export const { openModal, closeModal } = changeMemberRoleSlice.actions;
export const changeMemberRoleReducer = changeMemberRoleSlice.reducer;
