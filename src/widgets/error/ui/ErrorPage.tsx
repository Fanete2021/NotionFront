import React from 'react';
import styles from './ErrorPage.module.css';
import { Typography } from '@shared/ui/Typography';

interface ErrorPageProps {
  errorIcon: React.ReactNode;
  errorBadge?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  buttonActions?: React.ReactNode;
  afterActions?: React.ReactNode;
}

export const ErrorPage = ({
  errorIcon,
  errorBadge,
  title,
  description,
  buttonActions,
  afterActions,
}: ErrorPageProps) => {
  return (
    <main className={styles.errorPage}>
      <div className={styles.errorBody}>
        {errorIcon}

        {errorBadge}

        {title}
        {description}

        <div className={styles.errorButtons}>{buttonActions}</div>

        {afterActions}
      </div>
      <footer className={styles.errorFooter}>
        <Typography className={styles.rights} variant="caption">
          Notion · Все права защищены © 2024
        </Typography>
      </footer>
    </main>
  );
};
