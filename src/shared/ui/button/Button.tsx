'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './Button.module.css';

export type ButtonVariant = 'outline' | 'filled' | 'clear';
export type ButtonColor = 'normal' | 'danger' | 'success' | 'github';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonAlign = 'center' | 'start';
type Mods = Record<string, boolean | string | undefined>;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  color?: ButtonColor;

  // Тема кнопки. Определяет стиль (в рамке, без стилей, заливка цветом)
  variant?: ButtonVariant;

  // Флаг, определяющий квадратная кнопка или нет
  square?: boolean;

  // Размер кнопки
  size?: ButtonSize;

  // Увеличивает кнопку на всю свободную ширину
  fullWidth?: boolean;

  // Добавляет элемент слева
  addonLeft?: ReactNode;

  // Без отступов
  noPadding?: boolean;

  // Выравнивание содержимого по главной оси
  align?: ButtonAlign;
}

export const Button = (props: ButtonProps) => {
  const {
    className,
    children,
    variant = 'outline',
    square,
    disabled,
    fullWidth,
    size = 'md',
    addonLeft,
    color = 'normal',
    type = 'button',
    onClick,
    align = 'center',
    ...otherProps
  } = props;

  const mods: Mods = {
    [styles.square]: square,
    [styles.disabled]: disabled,
    [styles.fullWidth]: fullWidth,
    [styles.withAddon]: Boolean(addonLeft),
    [styles.alignStart]: align === 'start',
  };

  return (
    <button
      type={type}
      className={classNames(styles.button, mods, [
        styles[variant],
        styles[size],
        styles[color],
        className,
      ])}
      disabled={disabled}
      onClick={onClick}
      {...otherProps}
    >
      {addonLeft && <div className={styles.addonLeft}>{addonLeft}</div>}
      {children}
    </button>
  );
};
