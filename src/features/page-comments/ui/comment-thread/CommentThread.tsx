'use client';

import { useState } from 'react';
import classNames from 'classnames';
import styles from './CommentThread.module.css';
import { CommentForm } from '../comment-form/CommentForm';
import { getCommentErrorMessage } from '../../lib/getCommentErrorMessage';
import {
  CommentCard,
  type PageCommentThread,
  useCreatePageCommentMutation,
  useDeletePageCommentMutation,
  useSetPageCommentResolvedMutation,
  useUpdatePageCommentMutation,
} from '@entities/page-comment';
import { Button } from '@shared/ui/button';
import { Typography } from '@shared/ui/typography';
import { toast } from '@shared/ui/toast';
import PencilIcon from '@shared/assets/icons/pencil.svg';
import TrashIcon from '@shared/assets/icons/trash.svg';

type CommentThreadProps = {
  pageId: string;
  thread: PageCommentThread;
  currentUserId: string | null;
  /** Текст фрагмента: undefined — неизвестен (нет редактора), пустая строка — фрагмент удалён. */
  quote?: string;
  isActive?: boolean;
  onSelect?: () => void;
  /** Клик по цитате — показать фрагмент в документе. */
  onQuoteClick?: () => void;
  /** Удалён последний комментарий ветки. */
  onEmptied?: () => void;
};

const showError = (error: unknown) => {
  toast.add({ type: 'error', title: getCommentErrorMessage(error) });
};

export const CommentThread = ({
  pageId,
  thread,
  currentUserId,
  quote,
  isActive,
  onSelect,
  onQuoteClick,
  onEmptied,
}: CommentThreadProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const [createComment] = useCreatePageCommentMutation();
  const [updateComment] = useUpdatePageCommentMutation();
  const [setResolved] = useSetPageCommentResolvedMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeletePageCommentMutation();

  const { anchorId, comments, resolved } = thread;
  const resolvedBy = resolved ? comments[0].resolvedBy : null;

  const handleReply = async (body: string) => {
    try {
      await createComment({ pageId, body: { body, anchorId: anchorId ?? undefined } }).unwrap();
      setIsReplying(false);
    } catch (error) {
      showError(error);
      throw error;
    }
  };

  const handleEdit = (commentId: string) => async (body: string) => {
    try {
      await updateComment({ pageId, commentId, body }).unwrap();
      setEditingId(null);
    } catch (error) {
      showError(error);
      throw error;
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment({ pageId, commentId }).unwrap();
      setDeletingId(null);
      if (comments.length === 1) onEmptied?.();
    } catch (error) {
      showError(error);
    }
  };

  // На бэке статус у каждого комментария свой, а ветку решаем целиком.
  const handleToggleResolved = async () => {
    const nextResolved = !resolved;
    setIsResolving(true);
    try {
      await Promise.all(
        comments
          .filter((comment) => comment.resolved !== nextResolved)
          .map((comment) =>
            setResolved({ pageId, commentId: comment.id, resolved: nextResolved }).unwrap(),
          ),
      );
    } catch (error) {
      showError(error);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <article
      className={classNames(styles.root, {
        [styles.active]: isActive,
        [styles.resolved]: resolved,
      })}
      data-thread-anchor={anchorId ?? undefined}
      onClick={onSelect}
    >
      {anchorId && quote !== undefined ? (
        <button
          type="button"
          className={classNames(styles.quote, { [styles.quoteMissing]: !quote })}
          title={quote ? 'Показать в документе' : undefined}
          disabled={!quote}
          onClick={(event) => {
            event.stopPropagation();
            onQuoteClick?.();
          }}
        >
          {quote || 'Фрагмент удалён из документа'}
        </button>
      ) : null}

      {comments.map((comment) => {
        const isOwn = comment.authorInfo.id === currentUserId;
        const isEditing = editingId === comment.id;

        return (
          <div key={comment.id} className={styles.comment}>
            <CommentCard
              comment={comment}
              actions={
                isOwn && !isEditing ? (
                  <>
                    <Button
                      variant="clear"
                      size="sm"
                      square
                      aria-label="Изменить комментарий"
                      className={styles.iconButton}
                      onClick={() => {
                        setEditingId(comment.id);
                        setDeletingId(null);
                      }}
                    >
                      <PencilIcon className={styles.icon} />
                    </Button>
                    <Button
                      variant="clear"
                      size="sm"
                      square
                      aria-label="Удалить комментарий"
                      className={styles.iconButton}
                      onClick={() => setDeletingId(comment.id)}
                    >
                      <TrashIcon className={styles.icon} />
                    </Button>
                  </>
                ) : null
              }
            >
              {isEditing ? (
                <CommentForm
                  initialValue={comment.body}
                  submitLabel="Сохранить"
                  rows={2}
                  autoFocus
                  onSubmit={handleEdit(comment.id)}
                  onCancel={() => setEditingId(null)}
                />
              ) : undefined}
            </CommentCard>

            {deletingId === comment.id ? (
              <div className={styles.confirm} role="alertdialog" aria-label="Удаление комментария">
                <Typography variant="caption" className={styles.confirmText}>
                  Удалить комментарий?
                </Typography>
                <Button variant="clear" size="sm" onClick={() => setDeletingId(null)}>
                  Отмена
                </Button>
                <Button
                  variant="filled"
                  color="danger"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => void handleDelete(comment.id)}
                >
                  Удалить
                </Button>
              </div>
            ) : null}
          </div>
        );
      })}

      {resolvedBy ? (
        <Typography variant="caption" className={styles.resolvedBy}>
          Решено · {resolvedBy.name}
        </Typography>
      ) : null}

      {isReplying ? (
        <CommentForm
          placeholder="Ответить..."
          submitLabel="Ответить"
          rows={2}
          autoFocus
          onSubmit={handleReply}
          onCancel={() => setIsReplying(false)}
        />
      ) : (
        <div className={styles.actions}>
          {anchorId && !resolved ? (
            <Button variant="clear" className={styles.action} onClick={() => setIsReplying(true)}>
              Ответить
            </Button>
          ) : null}
          <Button
            variant="clear"
            className={styles.action}
            disabled={isResolving}
            onClick={() => void handleToggleResolved()}
          >
            {resolved ? 'Открыть снова' : 'Решить'}
          </Button>
        </div>
      )}
    </article>
  );
};
