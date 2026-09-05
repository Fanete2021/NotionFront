import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InviteLinkModalState {
  isInviteLinkModalOpen: boolean;
  createInviteLinkWorkspaceId: string | null;
  inviteLinkId: string | null;
}

const initialState: InviteLinkModalState = {
  isInviteLinkModalOpen: false,
  createInviteLinkWorkspaceId: null,
  inviteLinkId: null,
};

const inviteLinkModalSlice = createSlice({
  name: 'inviteLinkModal',
  initialState,
  reducers: {
    openInviteLinkModal: (
      state,
      action: PayloadAction<{ workspaceId: string; inviteLinkId?: string | null }>,
    ) => {
      state.isInviteLinkModalOpen = true;
      state.createInviteLinkWorkspaceId = action.payload.workspaceId;
      state.inviteLinkId = action.payload.inviteLinkId ?? null;
    },
    closeInviteLinkModal: (state) => {
      state.isInviteLinkModalOpen = false;
      state.createInviteLinkWorkspaceId = null;
      state.inviteLinkId = null;
    },
    setInviteLinkWorkspaceId: (state, action: PayloadAction<string>) => {
      state.createInviteLinkWorkspaceId = action.payload;
    },
    setInviteLinkId: (state, action: PayloadAction<string | null>) => {
      state.inviteLinkId = action.payload;
    },
  },
});

export const {
  openInviteLinkModal,
  closeInviteLinkModal,
  setInviteLinkWorkspaceId,
  setInviteLinkId,
} = inviteLinkModalSlice.actions;

export const inviteLinkModalReducer = inviteLinkModalSlice.reducer;
