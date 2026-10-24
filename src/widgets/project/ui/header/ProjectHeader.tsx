'use client';

import classNames from 'classnames';
import styles from './ProjectHeader.module.css';
import { ShareButton } from '@/features/change-version';
import { ChangeVersionButton } from '@/features/change-version';
import { usePageSession } from '@entities/page';
import { Button } from '@shared/ui/button';
import { Breadcrumbs } from '@shared/ui/breadcrumbs';
import { Avatar } from '@shared/ui/avatar';
import CommentIcon from '@shared/assets/icons/comment.svg';
import GlobusIcon from '@shared/assets/icons/globus.svg';
import MoreIcon from '@shared/assets/icons/more.svg';

interface Avatar {
  id: string;
  name: string;
  className?: string;
}

interface ProjectHeaderProps {
  breadcrumbs: string[];
  isCommentsOpen?: boolean;
  /** Сколько открытых обсуждений на странице. */
  commentsCount?: number;
  onCommentsClick?: () => void;
  onHistoryClick?: () => void;
  onPublishClick?: () => void;
}

export const ProjectHeader = ({
  breadcrumbs,
  isCommentsOpen,
  commentsCount = 0,
  onCommentsClick,
  onHistoryClick,
  onPublishClick,
}: ProjectHeaderProps) => {
  const session = usePageSession();
  const users = session?.users ?? [];
  return (
    <header className={styles.header}>
      <Breadcrumbs items={breadcrumbs.map((label) => ({ label }))} className={styles.nav} />
      <div className={styles.actions}>
        <div className={styles.avatars}>
          <div className={styles.avatars}>
            {users.map((user) => (
              <Avatar
                src={user.avatar}
                key={user.id}
                name={user.name}
                size="sm"
                className={styles.avatar}
              />
            ))}
          </div>
          <span className={styles.actionsDivider} />
        </div>
        <ShareButton />
        <Button
          type="button"
          variant="filled"
          size="sm"
          addonLeft={<GlobusIcon className={styles.icon} />}
          onClick={onPublishClick}
        >
          Публикация
        </Button>
        <ChangeVersionButton onClick={onHistoryClick} />
        <Button
          onClick={onCommentsClick}
          variant="clear"
          size="sm"
          square
          aria-label={commentsCount ? `Комментарии: ${commentsCount}` : 'Комментарии'}
          aria-pressed={isCommentsOpen}
          className={classNames(styles.iconButton, styles.commentsButton, {
            [styles.iconButtonActive]: isCommentsOpen,
          })}
        >
          <CommentIcon className={styles.icon} />
          {commentsCount > 0 ? (
            <span className={styles.commentsCount} aria-hidden>
              {commentsCount > 99 ? '99+' : commentsCount}
            </span>
          ) : null}
        </Button>
        <Button variant="clear" size="sm" square aria-label="Ещё" className={styles.iconButton}>
          <MoreIcon className={styles.icon} />
        </Button>
      </div>
    </header>
  );
};
