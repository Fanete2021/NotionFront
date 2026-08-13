'use client';

import { FC, HTMLAttributes } from 'react';
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

interface IconPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  selectedIcon: string | null;
  onChange: (icon: string | null) => void;
  className?: string;
}

export const IconPicker: FC<IconPickerProps> = ({ selectedIcon, onChange, className }) => {
  const handleIconClick = (icon: string) => {
    if (selectedIcon === icon) {
      onChange(null);
    } else {
      onChange(icon);
    }
  };

  return (
    <div className={classNames(styles.container, className)}>
      {ICONS.map((icon) => (
        <Button
          key={icon}
          variant="clear"
          className={classNames(styles.iconButton, {
            [styles.selected]: selectedIcon === icon,
          })}
          onClick={() => handleIconClick(icon)}
        >
          {icon}
        </Button>
      ))}
    </div>
  );
};
