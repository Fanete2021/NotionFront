import styles from './PasswordVisibilityButton.module.css';
import { ComponentPropsWithoutRef } from 'react';

interface PasswordVisibilityButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'onClick'> {
  isPasswordVisible: boolean;
  togglePasswordVisibility: () => void;
}

export const PasswordVisibilityButton = (props: PasswordVisibilityButtonProps) => {
  const {
    isPasswordVisible,
    togglePasswordVisibility,
    children,
    ...buttonProps
  } = props;
  return (
    <button
      className={styles.visibilityButton}
      aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
      aria-pressed={isPasswordVisible}
      onMouseDown={(event) => event.preventDefault()}
      onClick={togglePasswordVisibility}
      type="button"
      {...buttonProps}
    >
      {children}
    </button>
  );
};

