'use client';

import { type ReactNode, useMemo, useState } from 'react';
import type { Editor } from '@tiptap/core';
import {
  PageCommentsContext,
  type PageCommentsActions,
  type PageCommentsState,
} from '../../model/page-comments-context';
import {
  groupPageCommentThreads,
  useGetPageCommentsQuery,
  usePageCommentsRealtime,
} from '@entities/page-comment';

type PageCommentsProviderProps = {
  pageId: string;
  children: ReactNode;
};

export const PageCommentsProvider = ({ pageId, children }: PageCommentsProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draftAnchorId, setDraftAnchorId] = useState<string | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);

  usePageCommentsRealtime(pageId);
  const { data: comments, isLoading, isError, refetch } = useGetPageCommentsQuery(pageId);

  const threads = useMemo(() => groupPageCommentThreads(comments ?? []), [comments]);

  const openAnchorIds = threads.flatMap(({ anchorId, resolved }) =>
    anchorId && !resolved ? [anchorId] : [],
  );

  const cancelDraft = () => {
    if (draftAnchorId && editor && !editor.isDestroyed) {
      editor.commands.unsetCommentAnchor(draftAnchorId);
    }
    setDraftAnchorId(null);
  };

  const close = () => {
    cancelDraft();
    setIsOpen(false);
  };

  const state: PageCommentsState = {
    pageId,
    isOpen,
    threads,
    isLoading,
    isError,
    draftAnchorId,
    highlightedAnchorIds: draftAnchorId ? [...openAnchorIds, draftAnchorId] : openAnchorIds,
    editor,
  };

  const actions: PageCommentsActions = {
    toggle: () => (isOpen ? close() : setIsOpen(true)),
    close,
    refetch: () => void refetch(),
    startDraft: (anchorId) => {
      cancelDraft();
      setDraftAnchorId(anchorId);
      setIsOpen(true);
    },
    cancelDraft,
    completeDraft: () => setDraftAnchorId(null),
    setEditor,
  };

  return (
    <PageCommentsContext.Provider value={{ state, actions }}>
      {children}
    </PageCommentsContext.Provider>
  );
};
