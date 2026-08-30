'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './LoginForm.module.css';
import { useLoginMutation } from '../api/loginApi';
import { loginUserSchema } from '../utils/validationLoginFormConfig';
import { Input } from '@shared/ui/Input';
import { Checkbox } from '@shared/ui/Checkbox';
import { Button } from '@shared/ui/Button';
import Letter from '@shared/assets/icons/letter.svg';
import Lock from '@shared/assets/icons/lock.svg';
import Eye from '@shared/assets/icons/eye.svg';
import { Typography } from '@shared/ui/Typography';
import { ROUTES } from '@shared/routes';
import { useMutationWithError } from '@/shared/lib';
import { FormError } from '@/shared/ui/form-error';
import { HTTP_STATUS } from '@/shared/const/httpStatus';

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const { handleSubmit, control, reset } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginUserSchema),
  });
  const router = useRouter();

  const {
    execute: login,
    isLoading,
    error: errorMessage,
  } = useMutationWithError(useLoginMutation, {
    onSuccess: () => {
      router.replace('/');
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
    await login(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
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
        name="password"
        rules={{ required: 'Введите пароль' }}
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
            showPasswordToggle
            addonRight={<Eye />}
            placeholder="••••••••••••"
          />
        )}
      />

      <FormError message={errorMessage} />

      <div className={styles.actions}>
        <div className={styles.rememberMe}>
          <Checkbox className={styles.checkbox}>Запомнить меня</Checkbox>
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
