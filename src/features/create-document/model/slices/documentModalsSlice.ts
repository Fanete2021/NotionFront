import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DocumentModalsState {
  isCreateDocumentModalOpen: boolean;
  creatingDocumentProjectId: string | null;
}

const initialState: DocumentModalsState = {
  isCreateDocumentModalOpen: false,
  creatingDocumentProjectId: null,
};

const documentModalsSlice = createSlice({
  name: 'documentModals',
  initialState,
  reducers: {
    openCreateDocumentModal: (state, action: PayloadAction<{ projectId: string }>) => {
      state.isCreateDocumentModalOpen = true;
      state.creatingDocumentProjectId = action.payload.projectId;
    },
    closeCreateDocumentModal: (state) => {
      state.isCreateDocumentModalOpen = false;
      state.creatingDocumentProjectId = null;
    },
  },
});

export const { openCreateDocumentModal, closeCreateDocumentModal } = documentModalsSlice.actions;
export const documentModalsReducer = documentModalsSlice.reducer;
