export interface CalendarEvent {
  id: string;
  workspaceId: string;
  projectId: string | null;
  title: string;
  startAt: string;
  endAt: string;
  allDay: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCalendarEventDto {
  title: string;
  startAt: string;
  endAt: string;
  allDay: boolean;
  projectId: string | null;
}

export interface CreateCalendarEventDto {
  title: string;
  startAt: string;
  endAt: string;
  allDay?: boolean;
  projectId?: string;
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

export interface DeleteCalendarEventArgs {
  id: string;
  workspaceId: string;
}
