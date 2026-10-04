'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import React from 'react';
import classNames from 'classnames';
import styles from './Checkbox.module.css';
import CheckIcon from '@shared/assets/icons/checkbox-checked.svg';

type CheckboxProps = React.ComponentProps<typeof BaseCheckbox.Root> & {
  labelClassName?: string;
};

export const Checkbox = ({ children, className, labelClassName, ...props }: CheckboxProps) => {
  return (
    <label className={classNames(styles.label, labelClassName)}>
      <BaseCheckbox.Root className={classNames(styles.checkbox, className)} {...props}>
        <BaseCheckbox.Indicator className={styles.indicator}>
          <CheckIcon />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {children}
    </label>
  );
};
