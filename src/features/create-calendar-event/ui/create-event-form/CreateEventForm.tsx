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
  useUpdateCalendarEventMutation,
} from '@entities/calendar';
import { useGetProjectsByWorkspaceQuery } from '@entities/project';
import { Input } from '@shared/ui/Input';
import { Select } from '@shared/ui/select';
import Calendar from '@shared/assets/icons/calendar.svg';
import Clock from '@shared/assets/icons/clock.svg';
import { Button } from '@shared/ui/Button';
import PlusIcon from '@shared/assets/icons/plus.svg';
import { useAppDispatch, useAppSelector } from '@shared/lib';

interface CreateEventFormProps {
  event?: CalendarEvent;
}

export const CreateEventForm = ({ event }: CreateEventFormProps) => {
  const dispatch = useAppDispatch();
  const workspaceId = useAppSelector((state) => state.currentWorkspace.id);

  const { data: projects = [] } = useGetProjectsByWorkspaceQuery(workspaceId!, {
    skip: !workspaceId,
  });

  const projectOptions = useMemo(
    () => projects.map((p) => ({ value: p.id, label: p.name })),
    [projects],
  );

  const [createEvent, { isLoading: isCreating }] = useCreateCalendarEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateCalendarEventMutation();
  const isLoading = isCreating || isUpdating;

  const defaultValues = useMemo(() => buildEventFormDefaults(event), [event]);

  const { control, handleSubmit, reset } = useForm<
    CreateCalendarEventFormInput,
    unknown,
    CreateCalendarEventFormOutput
  >({
    resolver: zodResolver(createCalendarEventFormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [event?.id, defaultValues, reset]);

  const onSubmit = async (values: CreateCalendarEventFormOutput) => {
    if (!workspaceId) {
      console.warn('[CreateEventForm] workspaceId is empty');
      return;
    }

    const { startAt, endAt } = toIsoRange(values.date, values.startTime, values.endTime);

    try {
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
          },
        }).unwrap();
      } else {
        await createEvent({
          workspaceId,
          body: {
            title: values.title,
            startAt,
            endAt,
            allDay: false,
            ...(values.project ? { projectId: values.project } : {}),
          },
        }).unwrap();
      }
      dispatch(closeCreateEventModal());
    } catch (e) {
      console.error('[CreateEventForm] submit error', e);
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
              error={fieldState.error?.message}
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
              options={projectOptions}
              name={field.name}
              value={field.value ?? ''}
              onChange={(value) => field.onChange(value === '' ? undefined : value)}
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

      <NotificationsCard className={styles.full} />

      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
          Отмена
        </Button>
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
