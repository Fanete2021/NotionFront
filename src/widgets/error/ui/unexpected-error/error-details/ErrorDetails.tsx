import { useState } from 'react';
import classNames from 'classnames';
import styles from './ErrorDetails.module.css';
import { formatErrorDate } from '../../../utils/formatErrorDate';
import { Card } from '@shared/ui/Card';
import Dropdown from '@shared/assets/icons/chevron-down.svg';
import Warning from '@shared/assets/icons/danger-error.svg';
import { Typography } from '@shared/ui/Typography';

type Mods = Record<string, boolean | string | undefined>;

interface ErrorDetailsProps {
  errorCode: string | number;
  occuredAt: Date;
  error: Error & { digest?: string };
}

export const ErrorDetails = ({ errorCode, error, occuredAt }: ErrorDetailsProps) => {
  const errorDate = formatErrorDate(occuredAt);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleErrorVisible = () => {
    setIsOpen((prev) => !prev);
  };

  const mods: Mods = {
    [styles.hidden]: !isOpen,
    [styles.visible]: isOpen,
  };

  const iconMods: Mods = {
    [styles.dropdownRotated]: !isOpen,
  };

  return (
    <Card className={styles.errorCard} variant="outlined">
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <div className={classNames(styles.dropdown, iconMods)} onClick={toggleErrorVisible}>
            <Dropdown />
          </div>
          <Typography className={styles.title} variant="text-label">
            Подробности ошибки
          </Typography>
        </div>
        <div className={styles.codeError}>
          <div className={styles.warning}>
            <Warning />
          </div>
          <Typography className={styles.error} variant="text-medium">
            {errorCode} {error.message}
          </Typography>
        </div>
      </div>
      <div className={classNames(styles.cardContent, mods)}>
        <div className={styles.contentBody}>
          <Typography className={styles.stack} variant="text-regular">
            {error.stack}
          </Typography>
          <div className={styles.cardDivider} />
          <div className={styles.cardFooter}>
            <Typography className={styles.errorId} variant="text-micro">
              Error ID: {error.digest}
            </Typography>
            <Typography variant="text-micro">{errorDate}</Typography>
          </div>
        </div>
      </div>
    </Card>
  );
};
