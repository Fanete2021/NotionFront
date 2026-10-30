import type { CreateCalendarEventFormInput } from '../validation-create-calendar-event-config/validationCreateCalendarEventConfig';
import { toTimeKey } from '../date-keys/dateKeys';
import type { CalendarEvent } from '@entities/calendar';

const CREATE_DEFAULTS: Partial<CreateCalendarEventFormInput> = {
  startTime: '14:00',
  endTime: '14:30',
  taskType: 'meet',
  repeatable: 'no-repeat',
  reminderMinutes: '15',
  telegramReminder: true,
};

export const buildEventFormDefaults = (
  event?: CalendarEvent,
  defaultDate?: string | null,
): Partial<CreateCalendarEventFormInput> => {
  if (!event) {
    return {
      ...CREATE_DEFAULTS,
      date: defaultDate ? new Date(`${defaultDate}T00:00:00`) : undefined,
    };
  }

  return {
    title: event.title,
    date: new Date(event.startAt),
    startTime: toTimeKey(event.startAt),
    endTime: toTimeKey(event.endAt),
    project: event.projectId ?? undefined,
    taskType: 'meet',
    repeatable: 'no-repeat',
    reminderMinutes: String(
      event.reminderMinutes ?? 15,
    ) as CreateCalendarEventFormInput['reminderMinutes'],
    telegramReminder: event.telegramReminder ?? false,
  };
};
