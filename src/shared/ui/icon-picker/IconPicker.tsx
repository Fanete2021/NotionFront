'use client';

import { ElementType, FC, HTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './IconPicker.module.css';
import { PROJECT_ICONS } from './icons';
import { Button } from '@/shared/ui/Button';

interface IconPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  selectedIcon: string | null;
  onChange: (icon: string | null) => void;
  icons?: Record<string, ElementType>;
  // цвет выбранной иконки и ее рамки
  color?: string | null;
  className?: string;
}

export const IconPicker: FC<IconPickerProps> = ({
  selectedIcon,
  onChange,
  icons = PROJECT_ICONS,
  color,
  className,
}) => {
  const handleIconClick = (icon: string) => {
    if (selectedIcon === icon) {
      onChange(null);
    } else {
      onChange(icon);
    }
  };

  return (
    <div className={classNames(styles.container, className)}>
      {Object.entries(icons).map(([name, Icon]) => {
        const isSelected = selectedIcon === name;
        const accent = isSelected && color ? color : undefined;

        return (
          <Button
            key={name}
            variant="clear"
            aria-label={name}
            aria-pressed={isSelected}
            className={classNames(styles.iconButton, {
              [styles.selected]: isSelected,
            })}
            style={accent ? { borderColor: accent } : undefined}
            onClick={() => handleIconClick(name)}
          >
            <Icon className={styles.icon} style={accent ? { color: accent } : undefined} />
          </Button>
        );
      })}
    </div>
  );
};
