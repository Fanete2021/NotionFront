import { LogoutRequest } from '@entities/User';
import { baseApi } from '@shared/api/baseApi';

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
    }),
  }),

  overrideExisting: false,
});

export const { useLogoutMutation } = logoutApi;
