'use client';

import { createContext, useContext } from 'react';
import type { Editor } from '@tiptap/core';

export type PageCommentsState = {
  pageId: string;
  isOpen: boolean;
  toggle: () => void;
  /** Закрывает панель и отменяет недописанный комментарий к фрагменту. */
  close: () => void;
  /** Ветка, подсвеченная и в панели, и в тексте. */
  activeAnchorId: string | null;
  setActiveAnchorId: (anchorId: string | null) => void;
  /** Открывает панель на ветке якоря — например, по клику на подсвеченный текст. */
  openThread: (anchorId: string) => void;
  /** Якорь, к которому сейчас пишут первый комментарий. */
  draftAnchorId: string | null;
  startDraft: (anchorId: string) => void;
  cancelDraft: () => void;
  completeDraft: () => void;
  /** Якоря с открытыми комментариями — их подсвечивает редактор. */
  highlightedAnchorIds: string[];
  openThreadsCount: number;
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
};

export const PageCommentsContext = createContext<PageCommentsState | null>(null);

export const usePageComments = () => {
  const context = useContext(PageCommentsContext);

  if (!context) {
    throw new Error('usePageComments must be used within PageCommentsProvider');
  }

  return context;
};
