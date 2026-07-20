"use client";

import styles from './Radio.module.css';
import React from "react";

type RadioProps = Omit<React.ComponentProps<"input">, "type"> & {
  label?: React.ReactNode;
};

export const Radio = ({
  label,
  className,
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
