'use client';

import styles from './ProjectHeader.module.css';
import { Button } from '@shared/ui/Button';
import { Typography } from '@shared/ui/Typography';
import { Avatar } from '@shared/ui/Avatar';
import { ShareButton } from '@features/projects/sharing';
import { ChangeVersionButton } from '@features/projects/change-version';
import CommentIcon from '@shared/assets/icons/comment.svg';
import ChevronRightIcon from '@shared/assets/icons/chevron-right-2.svg';
import ClockIcon from '@shared/assets/icons/clock.svg';
import MoreIcon from '@shared/assets/icons/more.svg';
import classNames from 'classnames';

const mockAvatars = [
  { id: '1', name: 'Женя Л.', className: styles.avatarGreen },
  { id: '2', name: 'Марк Р.', className: styles.avatarOrange },
];

type ProjectHeaderProps = {
  onCommentsClick?: () => void;
};

export const ProjectHeader = ({ onCommentsClick }: ProjectHeaderProps) => {
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
        <ChangeVersionButton />
        <Button variant="clear" size="sm" square aria-label="История" className={styles.iconButton}>
          <ClockIcon className={styles.icon} />
        </Button>
        <Button onClick={onCommentsClick} variant="clear" size="sm" square aria-label="Комментарии" className={styles.iconButton}>
          <CommentIcon className={styles.icon} />
        </Button>
        <Button variant="clear" size="sm" square aria-label="Ещё" className={styles.iconButton}>
          <MoreIcon className={styles.icon} />
        </Button>
      </div>
    </header>
  );
};
