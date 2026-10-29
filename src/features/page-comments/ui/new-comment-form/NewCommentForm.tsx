'use client';

import { CommentForm, type CommentFormProps } from '../comment-form/CommentForm';
import { getCommentErrorMessage } from '../../lib/getCommentErrorMessage';
import { useCreatePageCommentMutation } from '@entities/page-comment';
import { toast } from '@shared/ui/toast';

type NewCommentFormProps = Omit<CommentFormProps, 'onSubmit' | 'initialValue'> & {
  pageId: string;
  anchorId?: string;
  onCreated?: () => void;
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
