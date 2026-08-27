'use client';

import classNames from 'classnames';
import styles from './ProjectHeader.module.css';
import { ShareButton } from '@/features/change-version';
import { ChangeVersionButton } from '@/features/change-version';
import { Button } from '@shared/ui/Button';
import { Typography } from '@shared/ui/Typography';
import { Avatar } from '@shared/ui/Avatar';
import CommentIcon from '@shared/assets/icons/comment.svg';
import ChevronRightIcon from '@shared/assets/icons/chevron-right-2.svg';
import GlobusIcon from '@shared/assets/icons/globus.svg';
import MoreIcon from '@shared/assets/icons/more.svg';

const mockAvatars = [
  { id: '1', name: 'Женя Л.', className: styles.avatarGreen },
  { id: '2', name: 'Марк Р.', className: styles.avatarOrange },
];

type ProjectHeaderProps = {
  onCommentsClick?: () => void;
  onHistoryClick?: () => void;
};

export const ProjectHeader = ({ onCommentsClick, onHistoryClick }: ProjectHeaderProps) => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Typography variant="text-medium">Документы</Typography>
        <ChevronRightIcon className={styles.chevron} />
        <Typography variant="text-medium">Дизайн-система</Typography>
        <ChevronRightIcon className={styles.chevron} />
        <Typography variant="text-medium" className={styles.navCurrent}>
          Компоненты
        </Typography>
      </nav>
      <div className={styles.actions}>
        <div className={styles.avatars}>
          {mockAvatars.map((user) => (
            <Avatar
              key={user.id}
              name={user.name}
              size="sm"
              className={classNames(styles.avatar, user.className)}
            />
          ))}
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
