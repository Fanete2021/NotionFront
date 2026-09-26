import { UpdateUserDto, User } from '../model/User';
import { baseApi } from '@shared/api/baseApi';

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
    updateUserProfile: builder.mutation<User, { data: UpdateUserDto }>({
      query: ({ data }) => ({
        url: '/users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'User', id: result.id },
              { type: 'User', id: 'ME' },
            ]
          : [],
      extraOptions: {
        requiresAuth: true,
      },
    }),
  }),

  overrideExisting: false,
});

export const { useGetMeQuery, useUpdateUserProfileMutation } = userApi;
