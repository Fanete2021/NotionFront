'use client';

import { Fragment, useState } from 'react';
import classNames from 'classnames';
import styles from './ProjectHeader.module.css';
import { ShareButton } from '@/features/change-version';
import { ChangeVersionButton } from '@/features/change-version';
import { usePagePresence } from '@entities/page';
import { Button } from '@shared/ui/Button';
import { Typography } from '@shared/ui/Typography';
import { Avatar } from '@shared/ui/Avatar';
import CommentIcon from '@shared/assets/icons/comment.svg';
import ChevronRightIcon from '@shared/assets/icons/chevron-right-2.svg';
import GlobusIcon from '@shared/assets/icons/globus.svg';
import MoreIcon from '@shared/assets/icons/more.svg';

interface Avatar {
  id: string;
  name: string;
  className?: string;
}

interface ProjectHeaderProps {
  breadcrumbs: string[];
  onCommentsClick?: () => void;
  onHistoryClick?: () => void;
  pageId: string;
}

export const ProjectHeader = ({
  breadcrumbs,
  onCommentsClick,
  onHistoryClick,
  pageId,
}: ProjectHeaderProps) => {
  const { users } = usePagePresence(pageId);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {breadcrumbs.map((crumb, index) => (
          <Fragment key={`${crumb}-${index}`}>
            {index > 0 && <ChevronRightIcon className={styles.chevron} />}
            <Typography
              variant="text-medium"
              className={index === breadcrumbs.length - 1 ? styles.navCurrent : undefined}
            >
              {crumb}
            </Typography>
          </Fragment>
        ))}
      </nav>
      <div className={styles.actions}>
        <div className={styles.avatars}>
          {pageId && (
            <div className={styles.avatars}>
              {users.map((user) => (
                <Avatar key={user.id} name={user.name} size="sm" className={styles.avatar} />
              ))}
            </div>
          )}
          <span className={styles.actionsDivider} />
        </div>
        <ShareButton />
        <Button
          type="button"
          variant="filled"
          size="sm"
          addonLeft={<GlobusIcon className={styles.icon} />}
        >
          Публикация
        </Button>
        <ChangeVersionButton onClick={onHistoryClick} />
        <Button
          onClick={onCommentsClick}
          variant="clear"
          size="sm"
          square
          aria-label="Комментарии"
          className={styles.iconButton}
        >
          <CommentIcon className={styles.icon} />
        </Button>
        <Button variant="clear" size="sm" square aria-label="Ещё" className={styles.iconButton}>
          <MoreIcon className={styles.icon} />
        </Button>
      </div>
    </header>
  );
};
