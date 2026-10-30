'use client';

import { createContext, useContext } from 'react';
import type { Editor } from '@tiptap/core';
import type { PageCommentThread } from '@entities/page-comment';

export type PageCommentsState = {
  pageId: string;
  isOpen: boolean;
  threads: PageCommentThread[];
  isLoading: boolean;
  isError: boolean;
  draftAnchorId: string | null;
  highlightedAnchorIds: string[];
  editor: Editor | null;
};

export type PageCommentsActions = {
  toggle: () => void;
  close: () => void;
  refetch: () => void;
  startDraft: (anchorId: string) => void;
  cancelDraft: () => void;
  completeDraft: () => void;
  setEditor: (editor: Editor | null) => void;
};

export const PageCommentsContext = createContext<{
  state: PageCommentsState;
  actions: PageCommentsActions;
} | null>(null);

export const usePageComments = () => {
  const context = useContext(PageCommentsContext);

  if (!context) {
    throw new Error('usePageComments must be used within PageCommentsProvider');
  }

  return context;
};
