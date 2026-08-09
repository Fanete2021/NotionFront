import { User } from '../model/User';
import { baseApi } from '@shared/api/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => ({
        url: 'auth/me',
        method: 'GET',
      }),
      providesTags: ['User', 'Session'],

      extraOptions: {
        requiresAuth: true,
      },
    }),
  }),

  overrideExisting: false,
});

export const { useGetMeQuery } = userApi;
