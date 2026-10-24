'use client';

import { type FormEvent, type KeyboardEvent, useState } from 'react';
import classNames from 'classnames';
import styles from './CommentForm.module.css';
import { MAX_COMMENT_BODY_LENGTH } from '@entities/page-comment';
import { Button } from '@shared/ui/button';

type CommentFormProps = {
  initialValue?: string;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  rows?: number;
  /** Если промис отклонён, текст остаётся в поле. */
  onSubmit: (body: string) => Promise<unknown> | void;
  onCancel?: () => void;
  className?: string;
};

export const CommentForm = ({
  initialValue = '',
  placeholder = 'Добавить комментарий...',
  submitLabel = 'Отправить',
  autoFocus,
  rows = 3,
  onSubmit,
  onCancel,
  className,
}: CommentFormProps) => {
  const [value, setValue] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const body = value.trim();
  const canSubmit = Boolean(body) && body !== initialValue.trim() && !isSubmitting;

  const submit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(body);
      setValue('');
    } catch {
      // ошибку показывает вызывающий, текст не теряем
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      void submit();
    }
    if (event.key === 'Escape' && onCancel) {
      event.preventDefault();
      onCancel();
    }
  };

  return (
    <form className={classNames(styles.root, className)} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        value={value}
        placeholder={placeholder}
        rows={rows}
        maxLength={MAX_COMMENT_BODY_LENGTH}
        autoFocus={autoFocus}
        disabled={isSubmitting}
        aria-label={placeholder}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className={styles.actions}>
        {onCancel ? (
          <Button variant="clear" size="sm" className={styles.button} onClick={onCancel}>
            Отмена
          </Button>
        ) : null}
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
