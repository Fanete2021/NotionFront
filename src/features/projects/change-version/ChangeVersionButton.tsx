'use client';

import styles from './ChangeVersionButton.module.css';
import { Button } from '@shared/ui/Button';
import GlobusIcon from '@shared/assets/icons/globus.svg';

export const ChangeVersionButton = () => {
  return (
    <Button
      type="button"
      variant="filled"
      size="sm"
      addonLeft={<GlobusIcon className={styles.icon} />}
    >
      Публикация
    </Button>
  );
};
