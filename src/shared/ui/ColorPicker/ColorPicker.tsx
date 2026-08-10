'use client';

import { FC } from 'react';
import classNames from 'classnames';
import styles from './ColorPicker.module.css';
import CheckboxCheckedIcon from '@/shared/assets/icons/checkbox-checked.svg';

export const COLORS = [
  'var(--color-color-picker-blue)',
  'var(--color-color-picker-green)',
  'var(--color-color-picker-yellow)',
  'var(--color-color-picker-purple)',
  'var(--color-color-picker-dark-green)',
  'var(--color-color-picker-white)',
] as const;

interface ColorPickerProps {
  selectedColor: string | null;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorPicker: FC<ColorPickerProps> = ({ selectedColor, onChange, className }) => {
  return (
    <div className={classNames(styles.container, className)}>
      {COLORS.map((color) => (
        <button
          key={color}
          className={classNames(styles.colorButton, {
            [styles.selected]: selectedColor === color,
          })}
          style={{ backgroundColor: color }}
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
