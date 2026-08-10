'use client';

import { FC } from 'react';
import classNames from 'classnames';
import styles from './IconPicker.module.css';
import { Button } from '@/shared/ui/Button';

export const ICONS = [
  '📁',
  '📂',
  '️🗂️',
  '📋',
  '📌',
  '🚀',
  '💡',
  '🎯',
  '🔖',
  '📊',
  '📈',
  '⚙️',
] as const;

interface IconPickerProps {
  selectedIcon: string | null;
  onChange: (icon: string) => void;
  className?: string;
}

export const IconPicker: FC<IconPickerProps> = ({ selectedIcon, onChange, className }) => {
  return (
    <div className={classNames(styles.container, className)}>
      {ICONS.map((icon) => (
        <Button
          key={icon}
          variant="clear"
          className={classNames(styles.iconButton, {
            [styles.selected]: selectedIcon === icon,
          })}
          onClick={() => onChange(icon)}
        >
          {icon}
        </Button>
      ))}
    </div>
  );
};
