import { UserLoginRequest, UserDataResponse } from '@entities/User';
import { baseApi } from '@shared/api/baseApi';

export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<UserDataResponse, UserLoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = loginApi;
