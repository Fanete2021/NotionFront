'use client';

import styles from './ProjectHeader.module.css';
import { Button } from '@shared/ui/Button';
import { Typography } from '@shared/ui/Typography';
import { Avatar } from '@shared/ui/Avatar';
import ShareIcon from '@shared/assets/icons/share.svg';
import GlobusIcon from '@shared/assets/icons/globus.svg';
import CommentIcon from '@shared/assets/icons/comment.svg';
import ChevronRightIcon from '@shared/assets/icons/chevron-right.svg';
import ClockIcon from '@shared/assets/icons/clock.svg';
import MoreIcon from '@shared/assets/icons/more.svg';

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
              className={user.className}
            />
          ))}
        </div>
        <span className={styles.actionsDivider} />
        <Button variant="outline" size="sm" addonLeft={<ShareIcon className={styles.icon} />}>
          Поделиться
        </Button>
        <Button variant="filled" size="sm" addonLeft={<GlobusIcon className={styles.icon} />}>
          Публикация
        </Button>
        <Button variant="clear" size="sm" square aria-label="История">
          <ClockIcon className={styles.icon} />
        </Button>
        <Button onClick={onCommentsClick} variant="clear" size="sm" square aria-label="Комментарии">
          <CommentIcon className={styles.icon} />
        </Button>
        <Button variant="clear" size="sm" square aria-label="Ещё">
          <MoreIcon className={styles.icon} />
        </Button>
      </div>
    </header>
  );
};
