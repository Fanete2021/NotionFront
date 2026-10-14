import {
  CalendarEvent,
  CreateCalendarEventArgs,
  DeleteCalendarEventArgs,
  GetCalendarEventsArgs,
  UpdateCalendarEventArgs,
} from '../model/types/calendar.types';
import { baseApi } from '@/shared/api';

export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalendarEvents: builder.query<CalendarEvent[], GetCalendarEventsArgs>({
      query: ({ workspaceId, from, to, projectId }) => ({
        url: `/workspaces/${workspaceId}/events`,
        params: {
          from,
          to,
          ...(projectId ? { projectId } : {}),
        },
      }),
      extraOptions: { requiresAuth: true },
      providesTags: (result, error, { workspaceId }) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'CalendarEvent' as const, id })),
              { type: 'CalendarEvent' as const, id: `LIST:${workspaceId}` },
            ]
          : [{ type: 'CalendarEvent' as const, id: `LIST:${workspaceId}` }],
    }),

    createCalendarEvent: builder.mutation<CalendarEvent, CreateCalendarEventArgs>({
      query: ({ workspaceId, body }) => ({
        url: `/workspaces/${workspaceId}/events`,
        method: 'POST',
        body,
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { workspaceId }) => [
        { type: 'CalendarEvent', id: `LIST:${workspaceId}` },
      ],
    }),

    updateCalendarEvent: builder.mutation<CalendarEvent, UpdateCalendarEventArgs>({
      query: ({ id, body }) => ({
        url: `/events/${id}`,
        method: 'PATCH',
        body,
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { id, workspaceId }) => [
        { type: 'CalendarEvent', id },
        { type: 'CalendarEvent', id: `LIST:${workspaceId}` },
      ],
    }),

    deleteCalendarEvent: builder.mutation<void, DeleteCalendarEventArgs>({
      query: ({ id }) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { id, workspaceId }) => [
        { type: 'CalendarEvent', id },
        { type: 'CalendarEvent', id: `LIST:${workspaceId}` },
      ],
    }),
  }),
});
