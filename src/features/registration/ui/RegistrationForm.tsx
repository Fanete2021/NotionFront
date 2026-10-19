'use client';

import { Controller, SubmitHandler, useForm, FieldPath } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import styles from './RegistrationForm.module.css';
import { useRegisterMutation } from '../api/registerApi';
import type { RegistrationDto } from '../model/registration.types';
import {
  registerUserSchema,
  type RegistrationFormValues,
} from '../utils/validationRegisterFormConfig';
import { useRegistrationDraft } from '../model/useRegistrationDraft';
import type { AuthResult } from '@/entities/user';
import { Input } from '@shared/ui/input';
import { Checkbox } from '@shared/ui/checkbox';
import { Button } from '@shared/ui/button';
import Letter from '@shared/assets/icons/letter.svg';
import Lock from '@shared/assets/icons/lock.svg';
import Person from '@shared/assets/icons/person.svg';
import Lightning from '@shared/assets/icons/lightning.svg';
import Eye from '@shared/assets/icons/eye.svg';
import { FormError } from '@/shared/ui/form-error';
import { useMutationWithError } from '@/shared/lib';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { takeAuthReturnTo } from '@/shared/lib/authReturnTo';
import { ROUTES } from '@/shared/routes';

export const RegistrationForm = () => {
  const { handleSubmit, control, reset, setError, clearErrors, subscribe } =
    useForm<RegistrationFormValues>({
      defaultValues: {
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
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
  } = useMutationWithError<AuthResult, { body: RegistrationDto }>(useRegisterMutation, {
    onSuccess: () => {
      clearRegistrationDraft();
      router.replace(takeAuthReturnTo() ?? ROUTES.main);
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
      body: {
        email: values.email,
        password: values.password,
        name: `${values.name} ${values.surname}`,
      },
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
        acceptTerms: false,
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
        <Controller
          name="acceptTerms"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Checkbox
                ref={field.ref}
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                onBlur={field.onBlur}
                aria-invalid={fieldState.invalid}
              >
                Я принимаю Условия использования и Политику конфиденциальности
              </Checkbox>
              <FormError message={fieldState.error?.message ?? null} />
            </div>
          )}
        />
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
