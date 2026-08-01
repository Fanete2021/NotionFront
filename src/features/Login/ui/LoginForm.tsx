'use client';

import { Input } from '@shared/ui/Input';
import { Checkbox } from '@shared/ui/Checkbox';
import { Typography } from '@shared/ui/Typography';
import { Button } from '@shared/ui/Button';
import Letter from '@shared/assets/icons/letter.svg';
import Lock from '@shared/assets/icons/lock.svg';
import Eye from '@shared/assets/icons/eye.svg';
import Link from 'next/link';
import styles from './LoginForm.module.css';
import { ROUTES } from '@shared/routes';
import { usePasswordVisibility, PasswordVisibilityButton } from '@features/auth';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const {
    handleSubmit,
    control,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit: SubmitHandler<LoginFormValues> = (data) => alert(data);

  const { isPasswordVisible, toggleVisible } = usePasswordVisibility();
  return (
    <form onSubmit={handleSubmit(onSubmit)}
          className={styles.loginForm}>
      <Controller
        name="email"
        rules={{ required: 'Введите email' }}
        control={control}
        render={({ field, fieldState }) => (
          <Input
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            label="Email адрес"
            addonLeft={<Letter />}
            placeholder="you@example.com"
          />
        )}
      />

      <Controller
        name='password'
        rules={{ required: 'Введите пароль' }}
        control={control}
        render={({field, fieldState}) => (
          <Input
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            label="Пароль"
            type={isPasswordVisible ? 'text' : 'password'}
            addonLeft={<Lock />}
            addonRight={
              <PasswordVisibilityButton
                isPasswordVisible={isPasswordVisible}
                togglePasswordVisibility={toggleVisible}
              >
                <Eye />
              </PasswordVisibilityButton>
            }
            placeholder="••••••••••••"
          />
        )}
      />

      <div className={styles.actions}>
        <div className={styles.rememberMe}>
          <Checkbox className={styles.checkbox}>Запомнить меня</Checkbox>
        </div>
        <Link href={ROUTES.resetPassword} className={styles.forgotPasswordLink}>
          <Typography variant="text-medium"
                      className={styles.forgotPasswordText}
          >
            Забыли пароль?
          </Typography>
        </Link>
      </div>
      <Button
        className={styles.submitForm}
        type="submit"
        variant="filled"
        fullWidth
      >
        Войти
      </Button>
    </form>
  );
};

