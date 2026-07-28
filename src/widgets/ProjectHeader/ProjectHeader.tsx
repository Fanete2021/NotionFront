'use client';

import styles from './ProjectHeader.module.css';
import { Button } from '@shared/ui/Button';
import ShareIcon from '@shared/assets/icons/share.svg';
import GlobusIcon from '@shared/assets/icons/globus.svg';
import CommentIcon from '@shared/assets/icons/comment.svg';

export const ProjectHeader = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <span>Документы</span>
        <span>Дизайн-система</span>
        <span>Компоненты</span>
      </nav>
      <div className={styles.actions}>
        <Button variant="outline" size="sm" addonLeft={<ShareIcon className={styles.icon} />}>
          Поделиться
        </Button>
        <Button variant="filled" size="sm" addonLeft={<GlobusIcon className={styles.icon} />}>
          Публикация
        </Button>
        <Button onClick={() => console.log('comments')}  variant="outline" size="sm" square aria-label="Комментарии">
          <CommentIcon className={styles.icon} />
        </Button>
      </div>
    </header>
  );
};
