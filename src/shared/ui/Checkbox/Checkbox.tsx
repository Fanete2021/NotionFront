"use client"

import {Checkbox as BaseCheckbox} from '@base-ui/react/checkbox';
import styles from './Checkbox.module.css'
import React from "react";
import classNames from "classnames";
import CheckIcon from '@shared/assets/icons/checkbox-checked.svg';

type CheckboxProps = React.ComponentProps<typeof BaseCheckbox.Root>;

export const Checkbox = ({children, className, ...props}: CheckboxProps) => {
  return (
    <label className={styles.label}>
      <BaseCheckbox.Root
        className={classNames(styles.checkbox, className)}
        {...props}
      >
        <BaseCheckbox.Indicator className={styles.indicator}>
          <CheckIcon/>
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {children}
    </label>
  );
}