'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './LoginForm.module.css';
import { useLoginMutation } from '../api/loginApi';
import type { LoginDto } from '../model/login.types';
import { loginUserSchema, type LoginFormValues } from '../utils/validationLoginFormConfig';
import type { AuthResult } from '@/entities/user';
import { Input } from '@shared/ui/input';
import { Checkbox } from '@shared/ui/checkbox';
import { Button } from '@shared/ui/button';
import Letter from '@shared/assets/icons/letter.svg';
import Lock from '@shared/assets/icons/lock.svg';
import { Typography } from '@shared/ui/typography';
import { ROUTES } from '@shared/routes';
import { useMutationWithError } from '@/shared/lib';
import { FormError } from '@/shared/ui/form-error';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { takeAuthReturnTo } from '@/shared/lib/authReturnTo';
import Eye from '@shared/assets/icons/eye.svg';

export const LoginForm = () => {
  const { handleSubmit, control, reset } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    resolver: zodResolver(loginUserSchema),
  });
  const router = useRouter();

  const {
    execute: login,
    isLoading,
    error: errorMessage,
  } = useMutationWithError<AuthResult, { body: LoginDto }>(useLoginMutation, {
    onSuccess: () => {
      router.replace(takeAuthReturnTo() ?? ROUTES.main);
      reset();
    },
    fieldMap: {
      [HTTP_STATUS.BAD_REQUEST]: {
        field: 'email',
        message: 'Неверный логин или пароль',
      },
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    await login({ body: values });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
      <Controller
        name="email"
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
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            label="Пароль"
            type="password"
            addonLeft={<Lock />}
            addonRight={<Eye />}
            showPasswordToggle
            placeholder="••••••••••••"
          />
        )}
      />

      <FormError message={errorMessage} />

      <div className={styles.actions}>
        <div className={styles.rememberMe}>
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                className={styles.checkbox}
                checked={field.value}
                onCheckedChange={field.onChange}
              >
                Запомнить меня
              </Checkbox>
            )}
          />
        </div>
        <Link href={ROUTES.resetPassword} className={styles.forgotPasswordLink}>
          <Typography variant="text-medium" className={styles.forgotPasswordText}>
            Забыли пароль?
          </Typography>
        </Link>
      </div>
      <Button className={styles.submitForm} type="submit" variant="filled" fullWidth>
        {isLoading ? 'Вход...' : 'Войти'}
      </Button>
    </form>
  );
};
