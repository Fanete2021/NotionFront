'use client';

import React from 'react';
import classNames from 'classnames';
import styles from './Badge.module.css';
import { Typography } from '@/shared/ui/Typography';

export type BadgeStatus = 'verified' | 'pending' | 'failed' | 'new' | 'draft' | 'connected';

interface BadgeProps extends React.ComponentPropsWithRef<'div'> {
  className?: string;
  status?: BadgeStatus;
  text: string;
  color?: string;
  bgColor?: string;
  border?: string;
}

export const Badge = ({ className, status, text, color, bgColor, border }: BadgeProps) => {
  const isConnected = status === 'connected';

  const customStyle =
    color || bgColor || border
      ? {
          color: color ?? 'inherit',
          backgroundColor: bgColor ?? 'transparent',
          border: border ?? 'none',
        }
      : undefined;

  return (
    <div
      className={classNames(styles.badge, status && styles[status], className)}
      style={customStyle}
    >
      {isConnected && <span className={styles.dot} />}
      <Typography variant="caption" className={styles.text}>
        {text}
      </Typography>
    </div>
  );
};
