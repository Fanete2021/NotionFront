import { UserData } from '@/entities/user';
import { baseApi } from '@shared/api/baseApi';
import { setAccessToken } from '@shared/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<UserData, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['User', 'Session'],

      extraOptions: {
        requiresAuth: false,
      },

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setAccessToken(data.accessToken));

          dispatch(baseApi.util.invalidateTags(['User', 'Session']));
        } catch {
          // Ошибка обрабатывается состоянием RTK Query
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = loginApi;
