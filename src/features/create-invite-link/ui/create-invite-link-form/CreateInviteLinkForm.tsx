'use client';

import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import styles from './CreateInviteLinkForm.module.css';
import { InviteLink } from '../invite-link/InviteLink';
import {
  createInviteLinkFormSchema,
  type CreateInviteLinkFormValues,
} from '../../utils/validationCreateInviteLinkFormConfig';
import { useCreateWorkspaceInviteMutation } from '@/entities/workspace-invite';
import { WorkspaceRole } from '@/entities/workspace-members';
import { Typography } from '@shared/ui/typography';
import { Button } from '@shared/ui/button';
import { Radio } from '@shared/ui/radio';
import { useMutationWithError } from '@/shared/lib/hooks';
import { FormError } from '@/shared/ui/form-error';
import { HTTP_STATUS } from '@/shared/const/httpStatus';

interface CreateInviteLinkFormProps {
  workspaceId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  curRole?: WorkspaceRole;
}

export function CreateInviteLinkForm({
  workspaceId,
  onSuccess,
  onCancel,
  className,
  curRole,
}: CreateInviteLinkFormProps) {
  const { control, handleSubmit } = useForm<CreateInviteLinkFormValues>({
    resolver: zodResolver(createInviteLinkFormSchema),
    defaultValues: { type: 'PERMANENT' },
  });

  const {
    execute: createInvite,
    isLoading,
    error,
    fieldErrors,
  } = useMutationWithError(useCreateWorkspaceInviteMutation, {
    onSuccess: () => {
      onSuccess?.();
    },
    fieldMap: {
      [HTTP_STATUS.FORBIDDEN]: {
        field: 'type',
        message: 'У вас нет прав для создания ссылок',
      },
      [HTTP_STATUS.NOT_FOUND]: {
        field: 'workspaceId',
        message: 'Рабочее пространство не найдено',
      },
    },
  });

  const onSubmit: SubmitHandler<CreateInviteLinkFormValues> = async (values) => {
    try {
      await createInvite({
        workspaceId,
        body: {
          type: values.type,
          role: curRole,
        },
      });
    } catch (error) {
      console.error('Ошибка при создании ссылки:', error);
    }
  };

  return (
    <form className={classNames(styles.form, className)} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="text-micro" className={styles.title}>
        ТИП
      </Typography>

      <Controller
        name="type"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <div className={styles.linksContainer} role="radiogroup" aria-label="Тип ссылки">
              <Radio
                ref={field.ref}
                name={field.name}
                value="PERMANENT"
                checked={field.value === 'PERMANENT'}
                onChange={() => field.onChange('PERMANENT')}
                onBlur={field.onBlur}
                disabled={isLoading}
                className={classNames(styles.inviteOption, {
                  [styles.active]: field.value === 'PERMANENT',
                })}
                label={<InviteLink title="🔗 Постоянная" subtitle="Действует бессрочно" />}
              />
              <Radio
                name={field.name}
                value="TEMPORARY"
                checked={field.value === 'TEMPORARY'}
                onChange={() => field.onChange('TEMPORARY')}
                onBlur={field.onBlur}
                disabled={isLoading}
                className={classNames(styles.inviteOption, {
                  [styles.active]: field.value === 'TEMPORARY',
                })}
                label={<InviteLink title="⏱ Временная" subtitle="Действует 1 день" />}
              />
            </div>
            <FormError message={fieldState.error?.message ?? fieldErrors.type ?? null} />
          </>
        )}
      />

      <FormError message={fieldErrors.workspaceId ?? error} />

      <div className={styles.divider} />
      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Отмена
          </Button>
        )}
        <Button
          className={styles.createButton}
          variant="filled"
          type="submit"
          disabled={isLoading || !workspaceId}
        >
          {isLoading ? 'Создание...' : 'Создать ссылку'}
        </Button>
      </div>
    </form>
  );
}
