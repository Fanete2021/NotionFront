'use client';

import type { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './CommentCard.module.css';
import type { PageComment } from '../../model/page-comment.types';
import { formatRelativeTime, useRelativeTimeTick } from '@shared/lib';
import { Avatar } from '@shared/ui/avatar';
import { Typography } from '@shared/ui/typography';

type CommentCardProps = {
  comment: Pick<PageComment, 'body' | 'createdAt' | 'authorInfo'>;
  /** Кнопки справа от автора. */
  actions?: ReactNode;
  /** Заменяет текст комментария, например формой редактирования. */
  children?: ReactNode;
  className?: string;
};

const fullDateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const CommentCard = ({ comment, actions, children, className }: CommentCardProps) => {
  const tick = useRelativeTimeTick();
  const { authorInfo, createdAt, body } = comment;

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.head}>
        <Avatar name={authorInfo.name} src={authorInfo.avatarUrl} size="sm" fontWeight={700} />
        <div className={styles.meta}>
          <Typography variant="caption" className={styles.name}>
            {authorInfo.name}
          </Typography>
          <time
            className={styles.time}
            dateTime={createdAt}
            title={fullDateFormat.format(new Date(createdAt))}
          >
            {formatRelativeTime(createdAt, tick)}
          </time>
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
      {children ?? (
        <Typography variant="text-medium" className={styles.body}>
          {body}
        </Typography>
      )}
    </div>
  );
};
