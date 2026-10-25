import {
  CalendarEvent,
  CreateCalendarEventArgs,
  DeleteCalendarEventArgs,
  GetCalendarEventsArgs,
  SetCalendarEventCompletedArgs,
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

    setCalendarEventCompleted: builder.mutation<CalendarEvent, SetCalendarEventCompletedArgs>({
      query: ({ id, isCompleted }) => ({
        url: `/events/${id}/completion`,
        method: 'PATCH',
        body: { isCompleted },
      }),
      extraOptions: { requiresAuth: true },
      // Чекбокс переключается сразу во всех списках с этим событием, при ошибке откатываем
      async onQueryStarted({ id, isCompleted }, { dispatch, getState, queryFulfilled }) {
        const patches = calendarApi.util
          .selectInvalidatedBy(getState(), [{ type: 'CalendarEvent', id }])
          .filter(({ endpointName }) => endpointName === 'getCalendarEvents')
          .map(({ originalArgs }) =>
            dispatch(
              calendarApi.util.updateQueryData('getCalendarEvents', originalArgs, (draft) => {
                const event = draft.find((e) => e.id === id);
                if (event) event.isCompleted = isCompleted;
              }),
            ),
          );

        try {
          await queryFulfilled;
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
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
