"use client"; // <-- Эта строка обязательна для интерактивных компонентов

import styles from "./Button.module.css";
import React, { ButtonHTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

export type ButtonVariant = "outline" | "filled";
export type ButtonColor = "normal" | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
type Mods = Record<string, boolean | string | undefined>;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    // Тема кнопки. Определяет стиль (в рамке, без стилей, заливка цветом)
    variant?: ButtonVariant;
    // Флаг, определяющий квадратная кнопка или нет
    square?: boolean;
    // Размер кнопки
    size?: ButtonSize;
    disabled?: boolean;
    children?: ReactNode;
    // Увеличивает кнопку на всю свободную ширину
    fullWidth?: boolean;
    color?: ButtonColor;
    // Добавляет элемент слева
    addonLeft?: ReactNode;
}

export const Button = (props: ButtonProps) => {
    const {
        className,
        children,
        variant = "outline",
        square,
        disabled,
        fullWidth,
        size = "md",
        addonLeft,
        color = "normal",
        ...otherProps
    } = props;

    const mods: Mods = {
        [styles.square]: square,
        [styles.disabled]: disabled,
        [styles.fullWidth]: fullWidth,
        [styles.withAddon]: Boolean(addonLeft),
    };

    return (
        <button
            type="button"
            className={classNames(styles.Button, mods, [
                styles[variant],
                styles[size],
                styles[color],
                className,
            ])}
            disabled={disabled}
            {...otherProps}
        >
            {addonLeft && <div className={styles.addonLeft}>{addonLeft}</div>}
            {children}
        </button>
    );
};
