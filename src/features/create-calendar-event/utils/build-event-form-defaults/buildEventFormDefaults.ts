import type { CreateCalendarEventFormInput } from '../validation-create-calendar-event-config/validationCreateCalendarEventConfig';
import { toTimeKey } from '../date-keys/dateKeys';
import type { CalendarEvent } from '@entities/calendar';

const CREATE_DEFAULTS: Partial<CreateCalendarEventFormInput> = {
  startTime: '14:00',
  endTime: '14:30',
  taskType: 'meet',
  repeatable: 'no-repeat',
  notifications: false,
  telegramSend: true,
};

export const buildEventFormDefaults = (
  event?: CalendarEvent,
): Partial<CreateCalendarEventFormInput> => {
  if (!event) return CREATE_DEFAULTS;

  return {
    title: event.title,
    date: new Date(event.startAt),
    startTime: toTimeKey(event.startAt),
    endTime: toTimeKey(event.endAt),
    project: event.projectId ?? undefined,
    taskType: 'meet',
    repeatable: 'no-repeat',
    notifications: false,
    telegramSend: true,
  };
};
