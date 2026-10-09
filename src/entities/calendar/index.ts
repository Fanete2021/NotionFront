import { calendarApi } from './api/calendarApi';

export {
  selectIsCreateEventModalOpen,
  selectEditingEvent,
} from './model/selectors/selectIsCreateEventModalOpen';

export type { CalendarCell as CalendarCellData } from './model/types/calendar-cell';

export { DayTask } from './ui/day-task/DayTask';

export type { DayTask as DayTaskData } from './model/types/day-task';

export type { BadgeTask } from './model/types/badge-task';

export const {
  useGetCalendarEventsQuery,
  useCreateCalendarEventMutation,
  useUpdateCalendarEventMutation,
  useDeleteCalendarEventMutation,
} = calendarApi;

export type {
  CalendarEvent,
  UpdateCalendarEventDto,
  CreateCalendarEventDto,
  GetCalendarEventsArgs,
  CreateCalendarEventArgs,
  UpdateCalendarEventArgs,
  DeleteCalendarEventArgs,
} from './model/types/calendar.types';

export { eventToBadgeTask, eventToDayTask } from './model/utils/eventMappers';
