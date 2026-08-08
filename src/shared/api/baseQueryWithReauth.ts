import { fetchBaseQuery, FetchBaseQueryArgs } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { loggedOut, selectAccessToken, setAccessToken } from '@shared/api/authSlice';
import { baseApi } from '@shared/api/baseApi';

type ReauthExtraOptions = {
  requiresAuth?: boolean;
};

type RefreshData = {
  accessToken: string;
};

const isRefreshData = (data: unknown): data is RefreshData =>
  typeof data === 'object' &&
  data !== null &&
  'accessToken' in data &&
  typeof data.accessToken === 'string';

const mutex = new Mutex();

const baseQueryOptions: FetchBaseQueryArgs = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
  credentials: 'include',

  prepareHeaders: (headers, { getState }) => {
    const accessToken = selectAccessToken(getState() as Parameters<typeof selectAccessToken>[0]);

    if (accessToken) {
      headers.set('Authorization', `${accessToken}`);
    }
    return headers;
  },
};

const baseQuery = fetchBaseQuery(baseQueryOptions);

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  ReauthExtraOptions
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);
  if (extraOptions.requiresAuth && result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

        if (!refreshResult.error && isRefreshData(refreshResult.data)) {
          api.dispatch(setAccessToken(refreshResult.data.accessToken));

          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(loggedOut());
          api.dispatch(baseApi.util.resetApiState());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();

      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
