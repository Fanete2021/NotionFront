import { UserData } from '@entities/User';
import { baseApi } from '@shared/api/baseApi';
import { setAccessToken } from '@shared/api';

interface RegistrationRequest {
  email: string;
  password: string;
  name: string;
}

export const registerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<UserData, RegistrationRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body: body,
      }),

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

export const { useRegisterMutation } = registerApi;
