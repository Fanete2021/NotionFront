import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PAGE_TYPE, PageType } from '@/entities/page';

export interface DocumentModalsState {
  isCreateDocumentModalOpen: boolean;
  creatingDocumentProjectId: string | null;
  isEditDocumentModalOpen: boolean;
  editingDocumentId: string | null;
  editingDocumentTitle: string;
  editingDocumentIcon: string | null;
  editingDocumentType: PageType;
}

const initialState: DocumentModalsState = {
  isCreateDocumentModalOpen: false,
  creatingDocumentProjectId: null,
  isEditDocumentModalOpen: false,
  editingDocumentId: null,
  editingDocumentTitle: '',
  editingDocumentIcon: null,
  editingDocumentType: PAGE_TYPE.DOC,
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

    openEditDocumentModal: (
      state,
      action: PayloadAction<{
        documentId: string;
        title: string;
        icon?: string | null;
        type?: PageType;
      }>,
    ) => {
      state.isEditDocumentModalOpen = true;
      state.editingDocumentId = action.payload.documentId;
      state.editingDocumentTitle = action.payload.title;
      state.editingDocumentIcon = action.payload.icon ?? null;
      state.editingDocumentType = action.payload.type ?? PAGE_TYPE.DOC;
    },
    closeEditDocumentModal: (state) => {
      state.isEditDocumentModalOpen = false;
      state.editingDocumentId = null;
      state.editingDocumentTitle = '';
      state.editingDocumentIcon = null;
      state.editingDocumentType = PAGE_TYPE.DOC;
    },
  },
});

export const {
  openCreateDocumentModal,
  closeCreateDocumentModal,
  openEditDocumentModal,
  closeEditDocumentModal,
} = documentModalsSlice.actions;

export const documentModalsReducer = documentModalsSlice.reducer;
