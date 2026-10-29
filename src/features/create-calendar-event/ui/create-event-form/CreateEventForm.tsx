import classNames from 'classnames';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import styles from './CreateEventForm.module.css';
import {
  createCalendarEventFormSchema,
  type CreateCalendarEventFormInput,
  type CreateCalendarEventFormOutput,
} from '../../utils/validation-create-calendar-event-config/validationCreateCalendarEventConfig';
import { buildEventFormDefaults } from '../../utils/build-event-form-defaults/buildEventFormDefaults';
import { toDateKey, toIsoRange } from '../../utils/date-keys/dateKeys';
import { closeCreateEventModal } from '../../model/slices/createEventModalSlice';
import { NotificationsCard } from '../notifications-card/NotificationsCard';
import {
  type CalendarEvent,
  useCreateCalendarEventMutation,
  useDeleteCalendarEventMutation,
  useUpdateCalendarEventMutation,
} from '@entities/calendar';
import { useGetProjectsByWorkspaceQuery } from '@entities/project';
import { Input } from '@shared/ui/input';
import { Select } from '@shared/ui/select';
import Calendar from '@shared/assets/icons/calendar.svg';
import Clock from '@shared/assets/icons/clock.svg';
import { Button } from '@shared/ui/button';
import PlusIcon from '@shared/assets/icons/plus.svg';
import { useAppDispatch, useAppSelector, useMutationWithError } from '@shared/lib';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { FormError } from '@/shared/ui/form-error';

interface CreateEventFormProps {
  event?: CalendarEvent;
}

export const CreateEventForm = ({ event }: CreateEventFormProps) => {
  const dispatch = useAppDispatch();
  const workspaceId = useAppSelector((state) => state.currentWorkspace.id);
  const defaultDate = useAppSelector((state) => state.createEventModal?.defaultDate ?? null);

  const { data: projects = [] } = useGetProjectsByWorkspaceQuery(workspaceId!, {
    skip: !workspaceId,
  });

  const projectOptions = useMemo(
    () => projects.map((p) => ({ value: p.id, label: p.name })),
    [projects],
  );

  const {
    execute: createEvent,
    isLoading: isCreating,
    error: createError,
    fieldErrors: createFieldErrors,
  } = useMutationWithError(useCreateCalendarEventMutation, {
    onSuccess: () => dispatch(closeCreateEventModal()),
    fieldMap: {
      [HTTP_STATUS.UNPROCESSABLE_ENTITY]: {
        field: 'endTime',
        message: 'Время окончания должно быть позже начала',
      },
      [HTTP_STATUS.FORBIDDEN]: {
        field: 'root',
        message: 'Нет прав на создание события в этом проекте',
      },
      [HTTP_STATUS.NOT_FOUND]: {
        field: 'root',
        message: 'Проект или воркспейс не найден',
      },
    },
  });
  const {
    execute: updateEvent,
    isLoading: isUpdating,
    error: updateError,
    fieldErrors: updateFieldErrors,
  } = useMutationWithError(useUpdateCalendarEventMutation, {
    onSuccess: () => dispatch(closeCreateEventModal()),
    fieldMap: {
      [HTTP_STATUS.UNPROCESSABLE_ENTITY]: {
        field: 'endTime',
        message: 'Время окончания должно быть позже начала',
      },
      [HTTP_STATUS.FORBIDDEN]: {
        field: 'root',
        message: 'Нет прав на создание события в этом проекте',
      },
      [HTTP_STATUS.NOT_FOUND]: {
        field: 'project',
        message: 'Проект или воркспейс не найден',
      },
    },
  });
  const isLoading = isCreating || isUpdating;
  const fieldErrors = event ? updateFieldErrors : createFieldErrors;

  const {
    execute: deleteEvent,
    isLoading: isDeleting,
    error: deleteError,
    fieldErrors: deleteFieldErrors,
  } = useMutationWithError(useDeleteCalendarEventMutation, {
    onSuccess: () => dispatch(closeCreateEventModal()),
    fieldMap: {
      [HTTP_STATUS.FORBIDDEN]: {
        field: 'root',
        message: 'Нет прав на удаление этого события',
      },
      [HTTP_STATUS.NOT_FOUND]: {
        field: 'root',
        message: 'Событие не найдено',
      },
    },
  });

  const defaultValues = useMemo(
    () => buildEventFormDefaults(event, defaultDate),
    [event, defaultDate],
  );

  const { control, handleSubmit, reset } = useForm<
    CreateCalendarEventFormInput,
    unknown,
    CreateCalendarEventFormOutput
  >({
    resolver: zodResolver(createCalendarEventFormSchema),
    defaultValues,
  });

  const handleDelete = async () => {
    if (!event || !workspaceId) return;
    if (!confirm(`Удалить событие "${event.title}"?`)) return;

    await deleteEvent({ id: event.id, workspaceId });
  };

  useEffect(() => {
    reset(defaultValues);
  }, [event?.id, defaultValues, reset]);

  const onSubmit = async (values: CreateCalendarEventFormOutput) => {
    if (!workspaceId) {
      console.warn('[CreateEventForm] workspaceId is empty');
      return;
    }

    const { startAt, endAt } = toIsoRange(values.date, values.startTime, values.endTime);

    if (event) {
      await updateEvent({
        id: event.id,
        workspaceId,
        body: {
          title: values.title,
          startAt,
          endAt,
          allDay: false,
          projectId: values.project ?? null,
          telegramReminder: values.telegramReminder,
          reminderMinutes: values.reminderMinutes,
        },
      });
    } else {
      await createEvent({
        workspaceId,
        body: {
          title: values.title,
          startAt,
          endAt,
          allDay: false,
          telegramReminder: values.telegramReminder,
          reminderMinutes: values.reminderMinutes,
          ...(values.project ? { projectId: values.project } : {}),
        },
      });
    }
  };

  const onInvalid = (errors: unknown) => {
    console.warn('[CreateEventForm] validation errors', errors);
  };

  const handleCancel = () => {
    dispatch(closeCreateEventModal());
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <div className={classNames(styles.field, styles.full)}>
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              label="Название события"
              placeholder="Встреча с командой продукта"
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className={styles.field}>
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              type="date"
              label="Дата"
              addonLeft={<Calendar />}
              name={field.name}
              value={
                field.value instanceof Date
                  ? toDateKey(field.value)
                  : ((field.value as string) ?? '')
              }
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className={styles.field}>
        <Controller
          name="startTime"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              className={styles.timeInput}
              type="time"
              size="m"
              label="Начало"
              addonLeft={<Clock />}
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className={styles.field}>
        <Controller
          name="endTime"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              className={styles.timeInput}
              type="time"
              size="m"
              label="Конец"
              addonLeft={<Clock />}
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message ?? fieldErrors.endTime}
            />
          )}
        />
      </div>

      <div className={classNames(styles.field, styles.half)}>
        <Controller
          name="project"
          control={control}
          render={({ field }) => (
            <Select
              label="Проект"
              placeholder="Без проекта"
              placeholderDisabled={false}
              options={projectOptions}
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      <div className={classNames(styles.field, styles.half)}>
        <Controller
          name="taskType"
          control={control}
          render={({ field }) => (
            <Select
              label="Тип задачи"
              options={[{ value: 'meet', label: 'Встреча' }]}
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      <div className={styles.full}>
        <Controller
          name="repeatable"
          control={control}
          render={({ field }) => (
            <Select
              label="Повторение"
              options={[{ value: 'no-repeat', label: 'Не повторять' }]}
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      <NotificationsCard control={control} className={styles.full} />

      <FormError
        message={
          fieldErrors.root ?? deleteFieldErrors.root ?? createError ?? updateError ?? deleteError
        }
      />

      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
          Отмена
        </Button>

        {event && (
          <Button
            variant="outline"
            color="danger"
            onClick={handleDelete}
            disabled={isLoading || isDeleting}
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </Button>
        )}

        <Button
          variant="filled"
          type="submit"
          className={styles.submitButton}
          addonLeft={!event ? <PlusIcon /> : undefined}
          disabled={isLoading}
        >
          {isLoading
            ? event
              ? 'Сохранение...'
              : 'Создание...'
            : event
              ? 'Сохранить'
              : 'Создать событие'}
        </Button>
      </div>
    </form>
  );
};
