'use client';

import { useTransition } from 'react';
import styles from './ShareButton.module.css';
import { Button } from '@shared/ui/Button';
import ShareIcon from '@shared/assets/icons/share.svg';

export const ShareButton = () => {
  const [, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(() => {
      throw new Error('Internal Server Error');
    });

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={styles.button}
      onClick={handleClick}
      addonLeft={<ShareIcon className={styles.icon} />}
    >
      Поделиться
    </Button>
  );
};
