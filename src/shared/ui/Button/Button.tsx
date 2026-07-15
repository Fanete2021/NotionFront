"use client"; // <-- Эта строка обязательна для интерактивных компонентов

import styles from './Button.module.css';
import React from "react";

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: 'primary' | 'secondary';
  size?: 'xs' | 's' | 'md' | 'lg';
  children?: React.ReactNode;
};

export const Button = ({
   children,
   className,
   variant = 'primary',
   size = 'md',
   onClick,
   ...props
 }: ButtonProps) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={buttonClasses} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
