'use client';

import { useState } from 'react';
import styles from './CommentThread.module.css';
import { CommentForm } from '../comment-form/CommentForm';
import { NewCommentForm } from '../new-comment-form/NewCommentForm';
import { getCommentErrorMessage } from '../../lib/getCommentErrorMessage';
import {
  CommentCard,
  type PageCommentThread,
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
  currentUserId?: string;
  quote?: string;
};

const showError = (error: unknown) => {
  toast.add({ type: 'error', title: getCommentErrorMessage(error) });
};

export const CommentThread = ({ pageId, thread, currentUserId, quote }: CommentThreadProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const [updateComment] = useUpdatePageCommentMutation();
  const [setResolved] = useSetPageCommentResolvedMutation();
  const [deleteComment] = useDeletePageCommentMutation();

  const { anchorId, comments, resolved, resolvedBy } = thread;

  const handleEdit = async (commentId: string, body: string) => {
    try {
      await updateComment({ pageId, commentId, body }).unwrap();
      setEditingId(null);
    } catch (error) {
      showError(error);
      throw error;
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Удалить комментарий?')) return;

    try {
      await deleteComment({ pageId, commentId }).unwrap();
    } catch (error) {
      showError(error);
    }
  };

  // Статус «решён» на бэке у каждого комментария, а закрываем всю ветку.
  const handleToggleResolved = async () => {
    setIsResolving(true);
    try {
      await Promise.all(
        comments
          .filter((comment) => comment.resolved === resolved)
          .map((comment) =>
            setResolved({ pageId, commentId: comment.id, resolved: !resolved }).unwrap(),
          ),
      );
    } catch (error) {
      showError(error);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <article className={styles.root}>
      {anchorId && quote !== undefined && (
        <Typography variant="caption" className={styles.quote}>
          {quote || 'Фрагмент удалён из документа'}
        </Typography>
      )}

      {comments.map((comment) => {
        const isEditing = editingId === comment.id;
        const canManage = comment.authorInfo.id === currentUserId && !isEditing;

        return (
          <CommentCard
            key={comment.id}
            comment={comment}
            actions={
              canManage && (
                <>
                  <Button
                    variant="clear"
                    size="sm"
                    square
                    aria-label="Изменить комментарий"
                    className={styles.iconButton}
                    onClick={() => setEditingId(comment.id)}
                  >
                    <PencilIcon className={styles.icon} />
                  </Button>
                  <Button
                    variant="clear"
                    size="sm"
                    square
                    aria-label="Удалить комментарий"
                    className={styles.iconButton}
                    onClick={() => void handleDelete(comment.id)}
                  >
                    <TrashIcon className={styles.icon} />
                  </Button>
                </>
              )
            }
          >
            {isEditing && (
              <CommentForm
                initialValue={comment.body}
                submitLabel="Сохранить"
                rows={2}
                autoFocus
                onSubmit={(body) => handleEdit(comment.id, body)}
                onCancel={() => setEditingId(null)}
              />
            )}
          </CommentCard>
        );
      })}

      {resolvedBy && (
        <Typography variant="caption" className={styles.resolvedBy}>
          Решено · {resolvedBy.name}
        </Typography>
      )}

      {isReplying ? (
        <NewCommentForm
          pageId={pageId}
          anchorId={anchorId ?? undefined}
          placeholder="Ответить..."
          submitLabel="Ответить"
          rows={2}
          autoFocus
          onCreated={() => setIsReplying(false)}
          onCancel={() => setIsReplying(false)}
        />
      ) : (
        <div className={styles.actions}>
          {anchorId && !resolved && (
            <Button variant="clear" className={styles.action} onClick={() => setIsReplying(true)}>
              Ответить
            </Button>
          )}
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
