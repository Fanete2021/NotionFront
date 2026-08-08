import { User, UserLogoutRequest } from '@entities/User';
import { baseApi } from '@shared/api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => ({
        url: 'auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    logout: builder.mutation<void, UserLogoutRequest>({
      query: (body) => ({
        url: '/auth/logout',
        method: 'POST',
        body: body,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useGetMeQuery, useLogoutMutation } = userApi;
