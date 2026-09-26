'use client';

import { forwardRef, type ChangeEvent, type InputHTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './FileInput.module.css';
import { Typography } from '@/shared/ui/Typography';
import CameraIcon from '@/shared/assets/icons/camera.svg';

type NativeFileInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange' | 'readOnly' | 'size'
>;

interface FileInputProps extends NativeFileInputProps {
  className?: string;
  /** Используется только для состояния компонента: значение file input нельзя контролировать. */
  value?: File;
  label?: string;
  error?: string;
  onChange?: (file: File | undefined) => void;
  readonly?: boolean;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>((props, ref) => {
  const {
    className,
    value,
    label = 'Изменить фото',
    error,
    onChange,
    readonly,
    disabled,
    onBlur,
    ...inputProps
  } = props;

  const isDisabled = Boolean(readonly || disabled);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.files?.[0]);
  };

  return (
    <div className={cn(styles.container, className)}>
      <label
        className={cn(styles.button, {
          [styles.hasValue]: Boolean(value),
          [styles.error]: Boolean(error),
          [styles.disabled]: isDisabled,
        })}
      >
        <input
          {...inputProps}
          ref={ref}
          className={styles.input}
          type="file"
          disabled={isDisabled}
          aria-invalid={error ? true : undefined}
          onChange={handleChange}
          onBlur={onBlur}
        />
        <CameraIcon className={styles.icon} aria-hidden="true" />
        <span>{label}</span>
      </label>

      {error && (
        <Typography variant="text-regular" className={styles.errorLabel}>
          {error}
        </Typography>
      )}
    </div>
  );
});

FileInput.displayName = 'FileInput';
