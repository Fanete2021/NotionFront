'use client';

import { InputHTMLAttributes, ReactNode, useState } from 'react';
import cn from 'classnames';
import styles from './Input.module.css';
import { Typography } from '@/shared/ui/Typography';
import { usePasswordVisibility } from '@shared/ui/Input/lib/usePasswordVisibility';
import { Button } from '@shared/ui/Button';

type HTMLInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'readOnly' | 'size'
>;

type InputSize = 's' | 'm';

type Mods = Record<string, boolean | string | undefined>;

interface InputProps extends HTMLInputProps {
  className?: string;
  value?: string | number;
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
  readonly?: boolean;
  addonLeft?: ReactNode;
  addonRight?: ReactNode;
  size?: InputSize;
  showPasswordToggle?: boolean;
}

export const Input = (props: InputProps) => {
  const {
    className,
    value,
    onChange,
    type = 'text',
    placeholder,
    readonly,
    addonLeft,
    addonRight,
    label,
    error,
    size = 's',
    onFocus,
    onBlur,
    showPasswordToggle,
    ...otherProps
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const { isPasswordVisible, toggleVisible } = usePasswordVisibility();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const mods: Mods = {
    [styles.focused]: isFocused && !error && !readonly,
    [styles.error]: Boolean(error),
    [styles.disabled]: readonly,
    [styles.withAddonLeft]: Boolean(addonLeft),
    [styles.withAddonRight]: Boolean(addonRight),
    [styles[size]]: true,
    [styles.filled]: value !== undefined && value !== '',
  };

  const inputType = type === 'password' && showPasswordToggle && isPasswordVisible ? 'text' : type;

  const input = (
    <div className={cn(styles.inputWrapper, mods, className)}>
      {addonLeft && <div className={styles.addonLeft}>{addonLeft}</div>}
      <input
        type={inputType}
        value={value}
        onChange={onChangeHandler}
        className={styles.input}
        readOnly={readonly}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...otherProps}
      />
      {addonRight && (
        <div className={styles.addonRight}>
          {type === 'password' && showPasswordToggle ? (
            <Button
              onClick={toggleVisible}
              variant="clear"
              type="button"
              aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
              aria-pressed={isPasswordVisible}
              onMouseDown={(event) => event.preventDefault()}
            >
              {addonRight}
            </Button>
          ) : (
            addonRight
          )}
        </div>
      )}
    </div>
  );

  if (label || error) {
    return (
      <div className={styles.container}>
        {label && (
          <Typography variant="label" className={styles.label}>
            {label}
          </Typography>
        )}
        {input}
        {error && (
          <Typography variant="text-regular" className={styles.errorLabel}>
            {error}
          </Typography>
        )}
      </div>
    );
  }
  return input;
};
