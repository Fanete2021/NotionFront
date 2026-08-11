import { baseApi } from '@shared/api/baseApi';
import { loggedOut } from '@shared/api';

export interface LogoutRequest {
  allDevices: boolean;
}

export const logoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation<void, LogoutRequest>({
      query: (body) => ({
        url: '/auth/logout',
        method: 'POST',
        body: body,
      }),

      extraOptions: {
        requiresAuth: true,
      },

      invalidatesTags: ['User', 'Session'],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(loggedOut());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),
  }),

  overrideExisting: false,
});

export const { useLogoutMutation } = logoutApi;
