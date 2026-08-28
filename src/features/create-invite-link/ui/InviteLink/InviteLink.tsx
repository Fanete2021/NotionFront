import React from 'react';
import styles from './InviteLink.module.css';
import { Typography } from '@/shared/ui/Typography';

interface InviteLinkProps {
  title: string;
  subtitle: string;
}

export function InviteLink({ title, subtitle }: InviteLinkProps) {
  return (
    <div className={styles.inviteLink}>
      <Typography className={styles.title} variant="text-medium">
        {title}
      </Typography>
      <Typography className={styles.subtitle} variant="caption">
        {subtitle}
      </Typography>
    </div>
  );
}
