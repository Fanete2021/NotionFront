import type { LogoutDto } from '../model/logout.types';
import { clearCurrentWorkspace } from '@/entities/workspace';
import { baseApi, loggedOut } from '@/shared/api';

export const logoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation<void, { body: LogoutDto }>({
      query: ({ body }) => ({
        url: 'auth/logout',
        method: 'POST',
        body,
      }),

      extraOptions: {
        requiresAuth: true,
      },

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(loggedOut());
          dispatch(clearCurrentWorkspace());
          dispatch(baseApi.util.resetApiState());
        } catch {}
      },
    }),
  }),

  overrideExisting: false,
});

export const { useLogoutMutation } = logoutApi;
