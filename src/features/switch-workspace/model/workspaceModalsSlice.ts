import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorkspaceModalsState {
  isCreateWorkspaceModalOpen: boolean;
  isEditWorkspaceModalOpen: boolean;
  editingWorkspaceId: string | null;
  editingWorkspaceName: string;
  editingWorkspaceColor: string | null;
  editingWorkspaceIcon: string | null;
}

const initialState: WorkspaceModalsState = {
  isCreateWorkspaceModalOpen: false,
  isEditWorkspaceModalOpen: false,
  editingWorkspaceId: null,
  editingWorkspaceName: '',
  editingWorkspaceColor: null,
  editingWorkspaceIcon: null,
};

const workspaceModalsSlice = createSlice({
  name: 'workspaceModals',
  initialState,
  reducers: {
    openCreateWorkspaceModal: (state) => {
      state.isCreateWorkspaceModalOpen = true;
    },
    closeCreateWorkspaceModal: (state) => {
      state.isCreateWorkspaceModalOpen = false;
    },

    openEditWorkspaceModal: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        workspaceName: string;
        color?: string | null;
        icon?: string | null;
      }>,
    ) => {
      state.isEditWorkspaceModalOpen = true;
      state.editingWorkspaceId = action.payload.workspaceId;
      state.editingWorkspaceName = action.payload.workspaceName;
      state.editingWorkspaceColor = action.payload.color ?? null;
      state.editingWorkspaceIcon = action.payload.icon ?? null;
    },
    closeEditWorkspaceModal: (state) => {
      state.isEditWorkspaceModalOpen = false;
      state.editingWorkspaceId = null;
      state.editingWorkspaceName = '';
      state.editingWorkspaceColor = null;
      state.editingWorkspaceIcon = null;
    },
  },
});

export const {
  openCreateWorkspaceModal,
  closeCreateWorkspaceModal,
  openEditWorkspaceModal,
  closeEditWorkspaceModal,
} = workspaceModalsSlice.actions;

export const workspaceModalsReducer = workspaceModalsSlice.reducer;
