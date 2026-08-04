'use client';

import { Button } from '@shared/ui/Button';
import ShareIcon from '@shared/assets/icons/share.svg';
import styles from './ShareButton.module.css';

export const ShareButton = () => {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={styles.button}
      addonLeft={<ShareIcon className={styles.icon} />}
    >
      Поделиться
    </Button>
  );
};
