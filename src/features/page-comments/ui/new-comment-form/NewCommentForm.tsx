'use client';

import { CommentForm } from '../comment-form/CommentForm';
import { getCommentErrorMessage } from '../../lib/getCommentErrorMessage';
import { useCreatePageCommentMutation } from '@entities/page-comment';
import { toast } from '@shared/ui/toast';

type NewCommentFormProps = {
  pageId: string;
  /** Якорь в тексте. Без него комментарий относится ко всей странице. */
  anchorId?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onCreated?: () => void;
  onCancel?: () => void;
  className?: string;
};

export const NewCommentForm = ({
  pageId,
  anchorId,
  onCreated,
  ...formProps
}: NewCommentFormProps) => {
  const [createComment] = useCreatePageCommentMutation();

  const handleSubmit = async (body: string) => {
    try {
      await createComment({ pageId, body: { body, anchorId } }).unwrap();
      onCreated?.();
    } catch (error) {
      toast.add({ type: 'error', title: getCommentErrorMessage(error) });
      throw error;
    }
  };

  return <CommentForm {...formProps} onSubmit={handleSubmit} />;
};
