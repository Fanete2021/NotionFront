'use client';

import { ChangeEvent, SelectHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './Select.module.css';
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg';

export interface SelectOption {
  value: string;
  label: string;
}

type HTMLSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'>;

interface SelectProps extends HTMLSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const Select = ({ options, value, onChange, className, ...otherProps }: SelectProps) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={classNames(styles.wrapper, className)}>
      <select className={styles.select} value={value} onChange={handleChange} {...otherProps}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className={styles.icon} />
    </div>
  );
};
