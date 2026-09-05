'use client';

import { ElementType, FC, HTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './IconPicker.module.css';
import { PROJECT_ICONS } from './icons';
import { Button } from '@/shared/ui/Button';

interface IconPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  selectedIcon: string | null;
  onChange: (icon: string | null) => void;

  // набор иконок «имя → компонент», по умолчанию проектный
  icons?: Record<string, ElementType>;
  className?: string;
}

export const IconPicker: FC<IconPickerProps> = ({
  selectedIcon,
  onChange,
  icons = PROJECT_ICONS,
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
      {Object.entries(icons).map(([name, Icon]) => (
        <Button
          key={name}
          variant="clear"
          aria-label={name}
          aria-pressed={selectedIcon === name}
          className={classNames(styles.iconButton, {
            [styles.selected]: selectedIcon === name,
          })}
          onClick={() => handleIconClick(name)}
        >
          <Icon className={styles.icon} />
        </Button>
      ))}
    </div>
  );
};
