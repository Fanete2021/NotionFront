import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProjectModalsState {
  isCreateProjectModalOpen: boolean;
  creatingProjectWorkspaceId: string | null;
  isEditProjectModalOpen: boolean;
  editingProjectId: string | null;
  editingProjectName: string;
  editingProjectColor: string | null;
  editingProjectIcon: string | null;
}

const initialState: ProjectModalsState = {
  isCreateProjectModalOpen: false,
  creatingProjectWorkspaceId: null,
  isEditProjectModalOpen: false,
  editingProjectId: null,
  editingProjectName: '',
  editingProjectColor: null,
  editingProjectIcon: null,
};

const projectModalsSlice = createSlice({
  name: 'projectModals',
  initialState,
  reducers: {
    openCreateProjectModal: (state, action: PayloadAction<{ workspaceId: string }>) => {
      state.isCreateProjectModalOpen = true;
      state.creatingProjectWorkspaceId = action.payload.workspaceId;
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
      state.isEditProjectModalOpen = true;
      state.editingProjectId = action.payload.projectId;
      state.editingProjectName = action.payload.projectName;
      state.editingProjectColor = action.payload.color ?? null;
      state.editingProjectIcon = action.payload.icon ?? null;
    },
    closeEditProjectModal: (state) => {
      state.isEditProjectModalOpen = false;
      state.editingProjectId = null;
      state.editingProjectName = '';
      state.editingProjectColor = null;
      state.editingProjectIcon = null;
    },
  },
});

export const {
  openCreateProjectModal,
  closeCreateProjectModal,
  openEditProjectModal,
  closeEditProjectModal,
} = projectModalsSlice.actions;

export const projectModalsReducer = projectModalsSlice.reducer;
