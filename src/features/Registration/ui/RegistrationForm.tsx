'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './RegistrationForm.module.css';
import { useRegisterMutation } from '@features/Registration/api/registerApi';
import { registerUserSchema } from '@features/Registration/config/validationRegisterFormConfig';
import { Input } from '@shared/ui/Input';
import { Checkbox } from '@shared/ui/Checkbox';
import { Button } from '@shared/ui/Button';
import Letter from '@shared/assets/icons/letter.svg';
import Lock from '@shared/assets/icons/lock.svg';
import Person from '@shared/assets/icons/person.svg';
import Lightning from '@shared/assets/icons/lightning.svg';
import Eye from '@shared/assets/icons/eye.svg';

interface RegistrationFormValues {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegistrationForm = () => {
  const { handleSubmit, control } = useForm<RegistrationFormValues>({
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
  const [register, { isLoading, error: mutationError }] = useRegisterMutation();
  const onSubmit: SubmitHandler<RegistrationFormValues> = async (values) => {
    try {
      await register({
        email: values.email,
        password: values.password,
        name: `${values.name} ${values.surname}`,
      }).unwrap();

      router.replace('/login');
    } catch (error) {
      console.log(mutationError);
    }
  };

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
