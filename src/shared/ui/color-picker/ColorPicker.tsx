'use client';

import { FC, HTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './ColorPicker.module.css';
import CheckboxCheckedIcon from '@/shared/assets/icons/checkbox-checked.svg';
import { COLORS_LIST } from '@/shared/const/colors';

interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  selectedColor: string | null;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorPicker: FC<ColorPickerProps> = ({
  selectedColor,
  onChange,
  className,
  ...divProps
}) => {
  return (
    <div className={classNames(styles.container, className)} {...divProps}>
      {COLORS_LIST.map((color) => (
        <button
          key={color}
          type="button"
          className={classNames(styles.colorButton, {
            [styles.selected]: selectedColor === color,
          })}
          style={{ backgroundColor: color, color }}
          onClick={() => onChange(color)}
        >
          {selectedColor === color && (
            <span className={styles.iconWrapper}>
              <CheckboxCheckedIcon className={styles.icon} />
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
