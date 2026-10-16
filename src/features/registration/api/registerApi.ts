import type { RegistrationDto } from '../model/registration.types';
import { AuthResult } from '@/entities/user';
import { clearCurrentWorkspace } from '@/entities/workspace';
import { baseApi, setAccessToken } from '@/shared/api';

export const registerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResult, { body: RegistrationDto }>({
      query: ({ body }) => ({
        url: 'auth/register',
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

export const { useRegisterMutation } = registerApi;
