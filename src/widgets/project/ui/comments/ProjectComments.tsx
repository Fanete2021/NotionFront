'use client';

import { useMemo, useState } from 'react';
import { useEditorState } from '@tiptap/react';
import classNames from 'classnames';
import styles from './ProjectComments.module.css';
import { CommentThread, NewCommentForm, usePageComments } from '@features/page-comments';
import { useGetMeQuery } from '@entities/user';
import { collectCommentAnchorTexts } from '@shared/lib/tiptap/comment-anchor';
import { Typography } from '@shared/ui/typography';
import { Button } from '@shared/ui/button';
import CloseIcon from '@shared/assets/icons/x-close-2.svg';

type CommentsTab = 'open' | 'resolved';

const TABS: { value: CommentsTab; label: string }[] = [
  { value: 'open', label: 'Открытые' },
  { value: 'resolved', label: 'Решённые' },
];

const EMPTY_TEXT: Record<CommentsTab, string> = {
  open: 'Открытых комментариев нет',
  resolved: 'Решённых комментариев нет',
};

export const ProjectComments = () => {
  const { state, actions } = usePageComments();
  const { pageId, threads, isLoading, isError, draftAnchorId, editor } = state;
  const { data: me } = useGetMeQuery();
  const [tab, setTab] = useState<CommentsTab>('open');

  const threadsByTab = useMemo(
    () => ({
      open: threads.filter(({ resolved }) => !resolved),
      resolved: threads.filter(({ resolved }) => resolved),
    }),
    [threads],
  );

  const anchorTexts = useEditorState({
    editor,
    selector: ({ editor: current }) =>
      current && !current.isDestroyed ? collectCommentAnchorTexts(current.state.doc) : null,
  });

  const getQuote = (anchorId: string | null) =>
    anchorId && anchorTexts ? (anchorTexts[anchorId] ?? '') : undefined;

  const renderThreads = () => {
    if (isLoading) {
      return <Typography className={styles.placeholder}>Загрузка...</Typography>;
    }

    if (isError) {
      return (
        <div className={styles.placeholder}>
          <Typography>Не удалось загрузить комментарии</Typography>
          <Button variant="outline" size="sm" onClick={actions.refetch}>
            Повторить
          </Button>
        </div>
      );
    }

    if (threadsByTab[tab].length === 0) {
      return <Typography className={styles.placeholder}>{EMPTY_TEXT[tab]}</Typography>;
    }

    return threadsByTab[tab].map((thread) => (
      <CommentThread
        key={thread.id}
        pageId={pageId}
        thread={thread}
        currentUserId={me?.id}
        quote={getQuote(thread.anchorId)}
      />
    ));
  };

  return (
    <aside className={styles.root}>
      <div className={styles.header}>
        <Typography variant="text-regular">Комментарии</Typography>
        <Button
          onClick={actions.close}
          variant="clear"
          size="sm"
          square
          className={styles.closeButton}
          aria-label="Закрыть"
        >
          <CloseIcon className={styles.icon} />
        </Button>
      </div>

      <div className={styles.tabs}>
        {TABS.map(({ value, label }) => (
          <Button
            key={value}
            variant="clear"
            size="sm"
            className={classNames(styles.tab, { [styles.tabActive]: tab === value })}
            onClick={() => setTab(value)}
          >
            {label} · {threadsByTab[value].length}
          </Button>
        ))}
      </div>

      <div className={styles.list}>
        {draftAnchorId && (
          <div className={styles.draft}>
            <Typography variant="caption" className={styles.quote}>
              {getQuote(draftAnchorId)}
            </Typography>
            <NewCommentForm
              key={draftAnchorId}
              pageId={pageId}
              anchorId={draftAnchorId}
              autoFocus
              onCreated={actions.completeDraft}
              onCancel={actions.cancelDraft}
            />
          </div>
        )}
        {renderThreads()}
      </div>

      <div className={styles.footer}>
        <NewCommentForm pageId={pageId} />
      </div>
    </aside>
  );
};
