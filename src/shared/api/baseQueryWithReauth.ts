import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
  credentials: 'include',
});

let refreshPromise: Promise<void> | null = null;
let resolveRefresh: () => void = () => {};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const currentUrl = typeof args === 'string' ? args : args.url;

    if (currentUrl === '/auth/refresh') {
      return result;
    }

    if (!refreshPromise) {
      refreshPromise = new Promise((resolve) => {
        resolveRefresh = resolve;
      });

      const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

      if (refreshResult.data) {
        resolveRefresh();
        refreshPromise = null;

        result = await baseQuery(args, api, extraOptions);
      } else {
        resolveRefresh();
        refreshPromise = null;

        console.log('Logged Out');
      }
    } else {
      await refreshPromise;

      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
