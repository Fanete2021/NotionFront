'use client';

import type { ReactNode } from 'react';
import styles from './CommentCard.module.css';
import type { PageComment } from '../../model/page-comment.types';
import { formatRelativeTime, useRelativeTimeTick } from '@shared/lib';
import { Avatar } from '@shared/ui/avatar';
import { Typography } from '@shared/ui/typography';

type CommentCardProps = {
  comment: PageComment;
  actions?: ReactNode;
  children?: ReactNode;
};

export const CommentCard = ({ comment, actions, children }: CommentCardProps) => {
  const tick = useRelativeTimeTick();
  const { authorInfo, createdAt, body } = comment;

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <Avatar name={authorInfo.name} src={authorInfo.avatarUrl} size="sm" fontWeight={700} />
        <div className={styles.meta}>
          <Typography variant="caption" className={styles.name}>
            {authorInfo.name}
          </Typography>
          <Typography variant="caption" className={styles.time}>
            {formatRelativeTime(createdAt, tick)}
          </Typography>
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {children || (
        <Typography variant="text-medium" className={styles.body}>
          {body}
        </Typography>
      )}
    </div>
  );
};
