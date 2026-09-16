import { fetchBaseQuery, FetchBaseQueryArgs } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { loggedOut, selectAccessToken, setAccessToken } from './sessionSlice';

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
      headers.set('Authorization', `Bearer ${accessToken}`);
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
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 || !extraOptions?.requiresAuth) {
    return result;
  }

  if (mutex.isLocked()) {
    await mutex.waitForUnlock();
    return await baseQuery(args, api, extraOptions);
  }

  const release = await mutex.acquire();

  try {
    const refreshResult = await baseQuery(
      {
        url: 'auth/refresh',
        method: 'POST',
      },
      api,
      {},
    );

    if (!refreshResult.error && isRefreshData(refreshResult.data)) {
      api.dispatch(setAccessToken(refreshResult.data.accessToken));
      result = await baseQuery(args, api, extraOptions);
    } else if (refreshResult.error?.status === 401 || refreshResult.error?.status === 403) {
      api.dispatch(loggedOut());
    } else {
      console.error('[auth] refresh failed:', refreshResult.error);
    }
  } finally {
    release();
  }

  return result;
};
