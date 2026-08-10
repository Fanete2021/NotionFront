import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ModalsState {
  isCreateWorkspaceModalOpen: boolean;
  isEditWorkspaceModalOpen: boolean;
  editingWorkspaceId: string | null;
  editingWorkspaceName: string;
  editingWorkspaceColor: string | null;
  editingWorkspaceIcon: string | null;

  isCreateProjectModalOpen: boolean;
  creatingProjectWorkspaceId: string | null;
  isEditProjectModalOpen: boolean;
  editingProjectId: string | null;
  editingProjectName: string;
  editingProjectColor: string | null;
  editingProjectIcon: string | null;

  isCreateDocumentModalOpen: boolean;
  creatingDocumentProjectId: string | null;
}

const initialState: ModalsState = {
  isCreateWorkspaceModalOpen: false,
  isEditWorkspaceModalOpen: false,
  editingWorkspaceId: null,
  editingWorkspaceName: '',
  editingWorkspaceColor: null,
  editingWorkspaceIcon: null,

  isCreateProjectModalOpen: false,
  creatingProjectWorkspaceId: null,
  isEditProjectModalOpen: false,
  editingProjectId: null,
  editingProjectName: '',
  editingProjectColor: null,
  editingProjectIcon: null,

  isCreateDocumentModalOpen: false,
  creatingDocumentProjectId: null,
};

const modalsSlice = createSlice({
  name: 'modals',
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
      state.editingWorkspaceId = action.payload.workspaceId;
      state.editingWorkspaceName = action.payload.workspaceName;
      state.editingWorkspaceColor = action.payload.color ?? null;
      state.editingWorkspaceIcon = action.payload.icon ?? null;
      state.isEditWorkspaceModalOpen = true;
    },
    closeEditWorkspaceModal: (state) => {
      state.isEditWorkspaceModalOpen = false;
      state.editingWorkspaceId = null;
      state.editingWorkspaceName = '';
      state.editingWorkspaceColor = null;
      state.editingWorkspaceIcon = null;
    },

    openCreateProjectModal: (state, action: PayloadAction<{ workspaceId: string }>) => {
      state.creatingProjectWorkspaceId = action.payload.workspaceId;
      state.isCreateProjectModalOpen = true;
    },
    closeCreateProjectModal: (state) => {
      state.isCreateProjectModalOpen = false;
      state.creatingProjectWorkspaceId = null;
    },

    openEditProjectModal: (
      state,
      action: PayloadAction<{
        projectId: string;
        projectName: string;
        color?: string | null;
        icon?: string | null;
      }>,
    ) => {
      state.editingProjectId = action.payload.projectId;
      state.editingProjectName = action.payload.projectName;
      state.editingProjectColor = action.payload.color ?? null;
      state.editingProjectIcon = action.payload.icon ?? null;
      state.isEditProjectModalOpen = true;
    },
    closeEditProjectModal: (state) => {
      state.isEditProjectModalOpen = false;
      state.editingProjectId = null;
      state.editingProjectName = '';
      state.editingProjectColor = null;
      state.editingProjectIcon = null;
    },

    openCreateDocumentModal: (state, action: PayloadAction<{ projectId: string }>) => {
      state.creatingDocumentProjectId = action.payload.projectId;
      state.isCreateDocumentModalOpen = true;
    },
    closeCreateDocumentModal: (state) => {
      state.isCreateDocumentModalOpen = false;
      state.creatingDocumentProjectId = null;
    },
  },
});

export const {
  openCreateWorkspaceModal,
  closeCreateWorkspaceModal,
  openEditWorkspaceModal,
  closeEditWorkspaceModal,
  openCreateProjectModal,
  closeCreateProjectModal,
  openEditProjectModal,
  closeEditProjectModal,
  openCreateDocumentModal,
  closeCreateDocumentModal,
} = modalsSlice.actions;

export const modalsReducer = modalsSlice.reducer;
