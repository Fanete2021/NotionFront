import { UpdateUserDto, User } from '../model/user.types';
import { baseApi } from '@/shared/api';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => ({
        url: 'auth/me',
        method: 'GET',
      }),
      extraOptions: {
        requiresAuth: true,
      },
      providesTags: [{ type: 'User', id: 'ME' }, 'Session'],
    }),
    updateUserProfile: builder.mutation<User, { body: UpdateUserDto }>({
      query: ({ body }) => ({
        url: 'users/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error) => (error || !result ? [] : [{ type: 'User', id: 'ME' }]),
      extraOptions: {
        requiresAuth: true,
      },
    }),
  }),

  overrideExisting: false,
});

export const { useGetMeQuery, useUpdateUserProfileMutation } = userApi;
