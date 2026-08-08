import { UserDataResponse, RegistrationRequest } from '@entities/User';
import { baseApi } from '@shared/api/baseApi';

export const registerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<UserDataResponse, RegistrationRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body: body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useRegisterMutation } = registerApi;
