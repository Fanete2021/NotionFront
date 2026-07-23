"use client";

import styles from './FilterChip.module.css';
import React from "react";
import classNames from "classnames";

type FilterChipColor =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

type FilterChipProps = React.ComponentProps<'span'> & {
  label: React.ReactNode;
  color?: FilterChipColor;
  appearance?: 'filter' | 'add';
  showRemove?: boolean;
};

const colorClassName: Record<FilterChipColor, string> = {
  primary: styles.colorPrimary,
  success: styles.colorSuccess,
  warning: styles.colorWarning,
  danger: styles.colorDanger,
  info: styles.colorInfo,
  neutral: styles.colorNeutral,
};

export const FilterChip = ({
  label,
  color = 'neutral',
  appearance = 'filter',
  showRemove = false,
  className,
  ...props
}: FilterChipProps) => {
  const filterChipClasses = classNames(styles.filterChip, colorClassName[color], className)

  return (
    <span className={filterChipClasses} {...props}>
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
