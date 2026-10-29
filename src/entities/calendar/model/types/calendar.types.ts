export interface CalendarEvent {
  id: string;
  workspaceId: string;
  projectId: string | null;
  title: string;
  startAt: string;
  endAt: string;
  allDay: boolean;
  isCompleted: boolean;
  telegramReminder?: boolean;
  reminderMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCalendarEventDto {
  title: string;
  startAt: string;
  endAt: string;
  allDay: boolean;
  projectId: string | null;
  telegramReminder: boolean;
  reminderMinutes: number;
}

export interface CreateCalendarEventDto {
  title: string;
  startAt: string;
  endAt: string;
  allDay?: boolean;
  projectId?: string;
  telegramReminder: boolean;
  reminderMinutes: number;
}

export interface GetCalendarEventsArgs {
  workspaceId: string;
  from: string;
  to: string;
  projectId?: string;
}

export interface CreateCalendarEventArgs {
  workspaceId: string;
  body: CreateCalendarEventDto;
}

export interface UpdateCalendarEventArgs {
  id: string;
  workspaceId: string;
  body: UpdateCalendarEventDto;
}

export interface SetCalendarEventCompletedArgs {
  id: string;
  workspaceId: string;
  isCompleted: boolean;
}

export interface DeleteCalendarEventArgs {
  id: string;
  workspaceId: string;
}
