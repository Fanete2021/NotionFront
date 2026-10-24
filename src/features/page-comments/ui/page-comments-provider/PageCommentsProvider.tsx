'use client';

import { type ReactNode, useCallback, useMemo, useState } from 'react';
import type { Editor } from '@tiptap/core';
import { PageCommentsContext, type PageCommentsState } from '../../model/page-comments-context';
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
  const [activeAnchorId, setActiveAnchorId] = useState<string | null>(null);
  const [draftAnchorId, setDraftAnchorId] = useState<string | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);

  usePageCommentsRealtime(pageId);
  const { data: comments } = useGetPageCommentsQuery(pageId, { skip: !pageId });

  const openThreads = useMemo(
    () => groupPageCommentThreads(comments ?? []).filter(({ resolved }) => !resolved),
    [comments],
  );

  const highlightedAnchorIds = useMemo(() => {
    const anchorIds = openThreads.flatMap(({ anchorId }) => (anchorId ? [anchorId] : []));
    return draftAnchorId ? [...anchorIds, draftAnchorId] : anchorIds;
  }, [openThreads, draftAnchorId]);

  // Якорь недописанного комментария уже стоит в тексте — при отмене его надо снять.
  const cancelDraft = useCallback(() => {
    if (!draftAnchorId) return;
    if (editor && !editor.isDestroyed) editor.commands.unsetCommentAnchor(draftAnchorId);
    setDraftAnchorId(null);
    setActiveAnchorId((current) => (current === draftAnchorId ? null : current));
  }, [draftAnchorId, editor]);

  const startDraft = useCallback(
    (anchorId: string) => {
      cancelDraft();
      setDraftAnchorId(anchorId);
      setActiveAnchorId(anchorId);
      setIsOpen(true);
    },
    [cancelDraft],
  );

  const completeDraft = useCallback(() => setDraftAnchorId(null), []);

  const openThread = useCallback((anchorId: string) => {
    setActiveAnchorId(anchorId);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    cancelDraft();
    setActiveAnchorId(null);
    setIsOpen(false);
  }, [cancelDraft]);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else setIsOpen(true);
  }, [close, isOpen]);

  const value = useMemo<PageCommentsState>(
    () => ({
      pageId,
      isOpen,
      toggle,
      close,
      activeAnchorId,
      setActiveAnchorId,
      openThread,
      draftAnchorId,
      startDraft,
      cancelDraft,
      completeDraft,
      highlightedAnchorIds,
      openThreadsCount: openThreads.length,
      editor,
      setEditor,
    }),
    [
      pageId,
      isOpen,
      toggle,
      close,
      activeAnchorId,
      openThread,
      draftAnchorId,
      startDraft,
      cancelDraft,
      completeDraft,
      highlightedAnchorIds,
      openThreads.length,
      editor,
    ],
  );

  return <PageCommentsContext.Provider value={value}>{children}</PageCommentsContext.Provider>;
};
