import Link from 'next/link';
import { Typography } from '@shared/ui/Typography';
import styles from './AuthNavigationHint.module.css';

interface AuthNavigationHintProps {
  message: string;
  actionLabel: string;
  link: string;
}

export const AuthNavigationHint = ({ message, actionLabel, link }: AuthNavigationHintProps) => {
  return (
    <div className={styles.authHint}>
      <Typography className={styles.text} variant="label">
        {message}
      </Typography>
      <Link className={styles.link} href={link}>
        {actionLabel}
      </Link>
    </div>
  );
};
