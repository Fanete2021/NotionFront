'use client';

import { ChangeEvent, SelectHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './Select.module.css';
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg';
import { Typography } from '@shared/ui/Typography';

export interface SelectOption {
  value: string;
  label: string;
}

type HTMLSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange' | 'size'>;

interface SelectProps extends HTMLSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  label?: string;
}

export const Select = ({
  options,
  value,
  onChange,
  className,
  label,
  ...otherProps
}: SelectProps) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={classNames(styles.wrapper, className)}>
      {label && (
        <Typography variant="label" className={styles.label}>
          {label}
        </Typography>
      )}
      <div className={styles.container}>
        <select className={styles.select} value={value} onChange={handleChange} {...otherProps}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className={styles.icon} />
      </div>
    </div>
  );
};
