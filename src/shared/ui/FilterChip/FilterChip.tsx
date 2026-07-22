"use client";

import styles from './FilterChip.module.css';
import React from "react";

type FilterChipColor =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

type FilterChipProps = {
  label: React.ReactNode;
  color?: FilterChipColor;
  appearance?: 'filter' | 'add';
  showRemove?: boolean;
  className?: string;
};

export const FilterChip = ({
  label,
  color = 'neutral',
  appearance = 'filter',
  showRemove = false,
  className,
}: FilterChipProps) => {
  const colorClassName = {
    primary: styles.colorPrimary,
    success: styles.colorSuccess,
    warning: styles.colorWarning,
    danger: styles.colorDanger,
    info: styles.colorInfo,
    neutral: styles.colorNeutral,
  }[color];

  const filterChipClasses = [styles.filterChip, colorClassName, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={filterChipClasses}>
      {appearance === 'add' ? (
        <span className={styles.addPlus}>+</span>
      ) : (
        <span className={styles.dot} />
      )}
      <span>{label}</span>
      {appearance === 'filter' && showRemove && (
        <button type="button" className={styles.removeCross}>
          ×
        </button>
      )}
    </span>
  );
};
