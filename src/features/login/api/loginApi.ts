import type { LoginDto } from '../model/login.types';
import { AuthResult } from '@/entities/user';
import { clearCurrentWorkspace } from '@/entities/workspace';
import { baseApi, setAccessToken } from '@/shared/api';

export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResult, { body: LoginDto }>({
      query: ({ body }) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),

      extraOptions: {
        requiresAuth: false,
      },

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setAccessToken(data.accessToken));
          dispatch(clearCurrentWorkspace());
          dispatch(baseApi.util.resetApiState());
        } catch {
          // Ошибка обрабатывается состоянием RTK Query
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = loginApi;
