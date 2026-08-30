'use client';

import { Controller, SubmitHandler, useForm, FieldPath } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import styles from './RegistrationForm.module.css';
import { useRegisterMutation } from '../api/registerApi';
import { registerUserSchema } from '../utils/validationRegisterFormConfig';
import { useRegistrationDraft } from '../model/useRegistrationDraft';
import { Input } from '@shared/ui/Input';
import { Checkbox } from '@shared/ui/Checkbox';
import { Button } from '@shared/ui/Button';
import Letter from '@shared/assets/icons/letter.svg';
import Lock from '@shared/assets/icons/lock.svg';
import Person from '@shared/assets/icons/person.svg';
import Lightning from '@shared/assets/icons/lightning.svg';
import Eye from '@shared/assets/icons/eye.svg';
import { FormError } from '@/shared/ui/form-error';
import { useMutationWithError } from '@/shared/lib';
import { HTTP_STATUS } from '@/shared/const/httpStatus';

interface RegistrationFormValues {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegistrationForm = () => {
  const { handleSubmit, control, reset, setError, clearErrors, subscribe } =
    useForm<RegistrationFormValues>({
      defaultValues: {
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      resolver: zodResolver(registerUserSchema),
    });
  const router = useRouter();
  const { readRegistrationDraft, clearRegistrationDraft, saveRegistrationDraft } =
    useRegistrationDraft();

  const {
    execute: register,
    isLoading,
    error: errorMessage,
    fieldErrors,
    hasError,
    resetError,
  } = useMutationWithError(useRegisterMutation, {
    onSuccess: () => {
      clearRegistrationDraft();
      router.replace('/');
    },
    fieldMap: {
      [HTTP_STATUS.CONFLICT]: {
        field: 'email',
        message: 'Этот email уже используется',
      },
    },
  });

  useEffect(() => {
    if (hasError) {
      Object.entries(fieldErrors).forEach(([field, message]) => {
        setError(field as FieldPath<RegistrationFormValues>, {
          type: 'server',
          message,
        });
      });
    }
  }, [fieldErrors, setError, hasError]);

  const onSubmit: SubmitHandler<RegistrationFormValues> = async (values) => {
    clearErrors(['email']);
    resetError();

    await register({
      email: values.email,
      password: values.password,
      name: `${values.name} ${values.surname}`,
    });
  };

  useEffect(() => {
    const draft = readRegistrationDraft();

    if (draft) {
      reset({
        name: draft.name,
        surname: draft.surname,
        email: draft.email,
        password: '',
        confirmPassword: '',
      });
    }

    const unsubscribe = subscribe({
      name: ['name', 'surname', 'email'],
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        saveRegistrationDraft({
          name: values.name,
          surname: values.surname,
          email: values.email,
        });
      },
    });

    return unsubscribe;
  }, [readRegistrationDraft, reset, saveRegistrationDraft, subscribe]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.nameRow}>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Введите Имя' }}
          render={({ field, fieldState }) => (
            <Input
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              label="Имя"
              addonLeft={<Person />}
              placeholder="Иван"
            />
          )}
        />

        <Controller
          name="surname"
          control={control}
          rules={{ required: 'Введите Фамилию' }}
          render={({ field, fieldState }) => (
            <Input
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              label="Фамилия"
              addonLeft={<Person />}
              placeholder="Иванов"
            />
          )}
        />
      </div>
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
            showPasswordToggle
            addonLeft={<Lock />}
            addonRight={<Eye />}
            placeholder="••••••••••••"
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        rules={{ required: 'Подтвердите пароль' }}
        render={({ field, fieldState }) => (
          <Input
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            label="Подтвердите Пароль"
            type="password"
            addonLeft={<Lock />}
            placeholder="Повторите пароль"
          />
        )}
      />

      <div className={styles.privacy}>
        <Checkbox>Я принимаю Условия использования и Политику конфиденциальности</Checkbox>
      </div>

      <FormError message={errorMessage} />

      <Button
        className={styles.submitForm}
        variant="filled"
        fullWidth
        addonLeft={<Lightning />}
        type="submit"
      >
        {isLoading ? 'Создание аккаунта...' : 'Создать аккаунт бесплатно'}
      </Button>
    </form>
  );
};
