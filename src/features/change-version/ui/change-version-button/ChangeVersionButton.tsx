'use client';

import styles from './ChangeVersionButton.module.css';
import { Button } from '@shared/ui/Button';
import ClockIcon from '@shared/assets/icons/clock.svg';

type ChangeVersionButtonProps = {
  onClick?: () => void;
};

export const ChangeVersionButton = ({ onClick }: ChangeVersionButtonProps) => {
  return (
    <Button type="button" variant="clear" size="sm" square aria-label="История" onClick={onClick}>
      <ClockIcon className={styles.icon} />
    </Button>
  );
};
