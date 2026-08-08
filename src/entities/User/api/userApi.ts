import { User, LogoutRequest } from '@entities/User';
import { baseApi } from '@shared/api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => ({
        url: 'auth/me',
        method: 'GET',
      }),
      providesTags: ['User', 'Session'],
    }),
    logout: builder.mutation<void, LogoutRequest>({
      query: (body) => ({
        url: '/auth/logout',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['User', 'Session'],
    }),
  }),

  overrideExisting: false,
});

export const { useGetMeQuery, useLogoutMutation } = userApi;
