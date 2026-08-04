'use client';

import { Button } from '@shared/ui/Button';
import GlobusIcon from '@shared/assets/icons/globus.svg';
import styles from './ChangeVersionButton.module.css';

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
