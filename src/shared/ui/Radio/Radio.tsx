"use client";

import styles from './Radio.module.css';
import React from "react";

type RadioProps = React.ComponentProps<"input"> & {
  label?: React.ReactNode;
};

export const Radio = ({
  label,
  className,
  type: _type,
  ...props
}: RadioProps) => {
  const radioClasses = [
    styles.radio,
    className,
  ].filter(Boolean).join(' ');

  return (
    <label className={radioClasses}>
      <input
        type="radio"
        className={styles.input}
        {...props}
      />
      {label != null && label !== '' && (
        <span className={styles.label}>{label}</span>
      )}
    </label>
  );
};
