'use client';

import React from 'react';
import classNames from 'classnames';
import styles from './Badge.module.css';
import { Typography } from '@shared/ui/typography';

export type BadgeStatus = 'verified' | 'pending' | 'failed' | 'new' | 'draft' | 'connected';

interface BadgeProps extends React.ComponentPropsWithRef<'div'> {
  className?: string;
  status?: BadgeStatus;
  text: string;
  color?: string;
  bgColor?: string;
  border?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
}

export const Badge = ({
  className,
  status,
  text,
  color,
  bgColor,
  border,
  fontSize,
  fontWeight,
  padding,
}: BadgeProps) => {
  const isConnected = status === 'connected';

  const customStyle =
    color || bgColor || border
      ? {
          color: color ?? 'inherit',
          backgroundColor: bgColor ?? 'transparent',
          border: border ?? 'none',
          padding: padding ?? '3px 8px',
        }
      : undefined;

  const textStyle = fontSize
    ? {
        fontSize: fontSize,
        fontWeight: fontWeight,
      }
    : undefined;

  return (
    <div
      className={classNames(styles.badge, status && styles[status], className)}
      style={customStyle}
    >
      {isConnected && <span className={styles.dot} />}
      <Typography variant="caption" className={styles.text} style={textStyle}>
        {text}
      </Typography>
    </div>
  );
};
