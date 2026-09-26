'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import { useEffect } from 'react';
import styles from './ProfileSettingsForm.module.css';
import { ProfileCard } from './profile-card';
import { NotificationCard } from './notification-card';
import { TelegramCard } from './telegram-card';
import { defaultProfileSettings, ProfileSettings } from '../model/mock.api';
import { profileSettingsSchema } from '../utils/validationProfileSettingsConfig';
import { UpdateUserDto, useGetMeQuery, User, useUpdateUserProfileMutation } from '@entities/user';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { useMutationWithError } from '@shared/lib';
import { HTTP_STATUS } from '@shared/const/httpStatus';
import { FormError } from '@shared/ui/form-error';

const FORM_ID = 'editUserForm';

interface ProfileSettingsFormProps {
  className?: string;
}

export function ProfileSettingsForm({ className }: ProfileSettingsFormProps) {
  const { handleSubmit, control, reset } = useForm<ProfileSettings>({
    defaultValues: defaultProfileSettings,
    resolver: zodResolver(profileSettingsSchema),
  });

  const { data: userData } = useGetMeQuery();

  const {
    execute: updateUser,
    isLoading: isUpdating,
    error: updateError,
    fieldErrors: updateFieldErrors,
  } = useMutationWithError<User, { data: UpdateUserDto }>(useUpdateUserProfileMutation, {
    fieldMap: {
      [HTTP_STATUS.BAD_REQUEST]: {
        field: 'firstName',
        message: 'Поле Имя и фамилия не может быть пустым',
      },
      [HTTP_STATUS.UNAUTHORIZED]: {
        field: 'firstName',
        message: 'Пользователь не авторизован',
      },
      [HTTP_STATUS.FORBIDDEN]: {
        field: 'title',
        message: 'Нет прав на редактирование профилья',
      },
      [HTTP_STATUS.CONFLICT]: {
        field: 'email',
        message: 'Этот email уже занят',
      },
    },
  });

  const onSubmit: SubmitHandler<ProfileSettings> = async (values) => {
    try {
      const fullName = `${values.firstName} ${values.lastName}`.trim();
      const payload: UpdateUserDto = {
        email: values.email,
        name: fullName,
        avatarUrl: 'example@mail.com',
      };
      await updateUser({ data: payload });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userData) return;

    const [firstName, lastName] = userData.name.trim().split(' ');

    return reset({
      ...defaultProfileSettings,
      firstName,
      lastName,
      email: userData.email,
      avatarUrl: userData.avatarUrl ?? '',
      avatarFile: undefined,
    });
  }, [userData, reset]);

  return (
    <form
      id={FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      className={classNames(styles.form, className)}
    >
      <div className={styles.header}>
        <Typography variant="text-regular" className={styles.title}>
          Профиль
        </Typography>
        <Typography variant="text-regular" className={styles.description}>
          Управляйте личными данными и настройками рабочего пространства.
        </Typography>
      </div>
      <ProfileCard control={control} />
      <NotificationCard control={control} />
      <TelegramCard control={control} />

      <FormError message={updateError} />

      <Button
        className={styles.saveButton}
        form={FORM_ID}
        type="submit"
        variant="filled"
        align="start"
        fullWidth
      >
        {isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
      </Button>
    </form>
  );
}
