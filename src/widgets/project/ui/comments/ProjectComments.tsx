'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useEditorState } from '@tiptap/react';
import classNames from 'classnames';
import styles from './ProjectComments.module.css';
import { CommentThread, NewCommentForm, usePageComments } from '@features/page-comments';
import {
  groupPageCommentThreads,
  type PageCommentThread,
  useGetPageCommentsQuery,
} from '@entities/page-comment';
import { useGetMeQuery } from '@entities/user';
import {
  collectCommentAnchorTexts,
  scrollToCommentAnchor,
} from '@shared/lib/tiptap/comment-anchor';
import { Typography } from '@shared/ui/typography';
import { Button } from '@shared/ui/button';
import { Skeleton } from '@shared/ui/skeleton';
import CloseIcon from '@shared/assets/icons/x-close-2.svg';

type CommentsTab = 'open' | 'resolved';

const EMPTY_TEXT: Record<CommentsTab, string> = {
  open: 'Открытых комментариев нет. Выделите текст в документе и нажмите «Комментировать» или напишите ниже.',
  resolved: 'Решённых комментариев пока нет.',
};

export const ProjectComments = () => {
  const {
    pageId,
    close,
    activeAnchorId,
    setActiveAnchorId,
    draftAnchorId,
    cancelDraft,
    completeDraft,
    editor,
  } = usePageComments();

  const {
    data: comments,
    isLoading,
    isError,
    refetch,
  } = useGetPageCommentsQuery(pageId, {
    skip: !pageId,
  });
  const { data: me } = useGetMeQuery();

  const [tab, setTab] = useState<CommentsTab>('open');
  const listRef = useRef<HTMLDivElement>(null);

  const threads = useMemo(() => groupPageCommentThreads(comments ?? []), [comments]);
  const openThreads = threads.filter(({ resolved }) => !resolved);
  const resolvedThreads = threads.filter(({ resolved }) => resolved);
  const visibleThreads = tab === 'open' ? openThreads : resolvedThreads;

  const anchorTexts = useEditorState({
    editor,
    selector: ({ editor: current }) =>
      current && !current.isDestroyed ? collectCommentAnchorTexts(current.state.doc) : null,
  });

  // Ветку выбрали в тексте, а она на другой вкладке — переключаемся на неё.
  const [prevActiveAnchorId, setPrevActiveAnchorId] = useState(activeAnchorId);
  if (prevActiveAnchorId !== activeAnchorId) {
    setPrevActiveAnchorId(activeAnchorId);
    const activeThread = threads.find(({ anchorId }) => anchorId === activeAnchorId);
    if (activeThread) setTab(activeThread.resolved ? 'resolved' : 'open');
  }

  useEffect(() => {
    if (!activeAnchorId) return;
    listRef.current
      ?.querySelector(`[data-thread-anchor="${CSS.escape(activeAnchorId)}"]`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeAnchorId, tab]);

  const showInDocument = (anchorId: string) => {
    setActiveAnchorId(anchorId);
    if (editor && !editor.isDestroyed) scrollToCommentAnchor(editor.view.dom, anchorId);
  };

  const handleSelect = ({ anchorId }: PageCommentThread) => {
    if (anchorId && anchorId !== activeAnchorId) showInDocument(anchorId);
  };

  // Комментариев к якорю не осталось — снимаем якорь из текста, если есть права на правку.
  const handleEmptied = ({ anchorId }: PageCommentThread) => {
    if (!anchorId) return;
    if (editor && !editor.isDestroyed && editor.isEditable) {
      editor.commands.unsetCommentAnchor(anchorId);
    }
    if (activeAnchorId === anchorId) setActiveAnchorId(null);
  };

  const handlePageCommentCreated = () => {
    setTab('open');
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    });
  };

  const getQuote = (anchorId: string | null) => {
    if (!anchorId || !anchorTexts) return undefined;
    return anchorTexts[anchorId] ?? '';
  };

  const renderThreads = () => {
    if (isLoading) {
      return (
        <div className={styles.placeholder}>
          <Skeleton height={16} width="60%" />
          <Skeleton height={44} />
          <Skeleton height={16} width="40%" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className={styles.placeholder}>
          <Typography variant="caption" className={styles.placeholderText}>
            Не удалось загрузить комментарии
          </Typography>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            Повторить
          </Button>
        </div>
      );
    }

    if (visibleThreads.length === 0) {
      return (
        <div className={styles.placeholder}>
          <Typography variant="caption" className={styles.placeholderText}>
            {EMPTY_TEXT[tab]}
          </Typography>
        </div>
      );
    }

    return visibleThreads.map((thread) => {
      const { anchorId } = thread;

      return (
        <CommentThread
          key={thread.id}
          pageId={pageId}
          thread={thread}
          currentUserId={me?.id ?? null}
          quote={getQuote(anchorId)}
          isActive={Boolean(anchorId) && anchorId === activeAnchorId}
          onSelect={() => handleSelect(thread)}
          onQuoteClick={anchorId ? () => showInDocument(anchorId) : undefined}
          onEmptied={() => handleEmptied(thread)}
        />
      );
    });
  };

  const draftQuote = draftAnchorId ? anchorTexts?.[draftAnchorId] : undefined;

  return (
    <aside className={styles.root} aria-label="Комментарии">
      <div className={styles.header}>
        <Typography variant="text-regular">Комментарии</Typography>
        <Button
          onClick={close}
          variant="clear"
          size="sm"
          square
          className={styles.closeButton}
          aria-label="Закрыть"
        >
          <CloseIcon className={styles.icon} />
        </Button>
      </div>

      <div className={styles.tabs} role="tablist">
        {(['open', 'resolved'] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            className={classNames(styles.tab, { [styles.tabActive]: tab === value })}
            onClick={() => setTab(value)}
          >
            {value === 'open' ? 'Открытые' : 'Решённые'}
            <span className={styles.tabCount}>
              {value === 'open' ? openThreads.length : resolvedThreads.length}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.list} ref={listRef}>
        {draftAnchorId ? (
          <div className={styles.draft} data-thread-anchor={draftAnchorId}>
            {draftQuote ? <p className={styles.draftQuote}>{draftQuote}</p> : null}
            <NewCommentForm
              key={draftAnchorId}
              pageId={pageId}
              anchorId={draftAnchorId}
              placeholder="Комментарий к фрагменту..."
              autoFocus
              onCreated={() => {
                completeDraft();
                setTab('open');
              }}
              onCancel={cancelDraft}
            />
          </div>
        ) : null}
        {renderThreads()}
      </div>

      <div className={styles.footer}>
        <NewCommentForm
          pageId={pageId}
          placeholder="Комментарий к странице..."
          onCreated={handlePageCommentCreated}
        />
      </div>
    </aside>
  );
};
