'use client';

import React from 'react';
import classNames from 'classnames';
import styles from './FilterChip.module.css';

type FilterChipColor = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

type FilterChipProps = Omit<React.ComponentProps<'button'>, 'color'> & {
  label: React.ReactNode;
  color?: FilterChipColor;
  appearance?: 'filter' | 'add';
  showRemove?: boolean;
  active?: boolean;
  onRemove?: () => void;
};

const colorClassName: Record<FilterChipColor, string> = {
  primary: styles.colorPrimary,
  success: styles.colorSuccess,
  warning: styles.colorWarning,
  danger: styles.colorDanger,
  info: styles.colorInfo,
  neutral: styles.colorNeutral,
};

export function FilterChip({
  label,
  color = 'neutral',
  appearance = 'filter',
  showRemove = false,
  active = false,
  onRemove,
  className,
  onClick,
  type,
  ...props
}: FilterChipProps) {
  const filterChipClasses = classNames(
    styles.filterChip,
    colorClassName[color],
    { [styles.active]: active },
    className,
  );

  return (
    <button
      type={type ?? 'button'}
      className={filterChipClasses}
      aria-pressed={active}
      data-active={active || undefined}
      onClick={onClick}
      {...props}
    >
      {appearance === 'add' ? (
        <span className={styles.addPlus}>+</span>
      ) : (
        <span className={styles.dot} />
      )}
      <span>{label}</span>
      {appearance === 'filter' && showRemove && (
        <span
          role="button"
          tabIndex={-1}
          className={styles.removeCross}
          aria-label="Удалить"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          ×
        </span>
      )}
    </button>
  );
}
