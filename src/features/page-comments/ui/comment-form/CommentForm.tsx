'use client';

import { type FormEvent, useState } from 'react';
import styles from './CommentForm.module.css';
import { MAX_COMMENT_BODY_LENGTH } from '@entities/page-comment';
import { Button } from '@shared/ui/button';

export type CommentFormProps = {
  initialValue?: string;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  rows?: number;
  onSubmit: (body: string) => Promise<unknown>;
  onCancel?: () => void;
};

export const CommentForm = ({
  initialValue = '',
  placeholder = 'Добавить комментарий...',
  submitLabel = 'Отправить',
  autoFocus,
  rows = 3,
  onSubmit,
  onCancel,
}: CommentFormProps) => {
  const [value, setValue] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const body = value.trim();
  const canSubmit = Boolean(body) && body !== initialValue.trim() && !isSubmitting;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(body);
      setValue('');
    } catch {
      // при ошибке оставляем текст в поле
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.root} onSubmit={(event) => void handleSubmit(event)}>
      <textarea
        className={styles.textarea}
        value={value}
        placeholder={placeholder}
        rows={rows}
        maxLength={MAX_COMMENT_BODY_LENGTH}
        autoFocus={autoFocus}
        disabled={isSubmitting}
        onChange={(event) => setValue(event.target.value)}
      />
      <div className={styles.actions}>
        {onCancel && (
          <Button variant="clear" size="sm" className={styles.button} onClick={onCancel}>
            Отмена
          </Button>
        )}
        <Button
          type="submit"
          variant="filled"
          size="sm"
          className={styles.button}
          disabled={!canSubmit}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
