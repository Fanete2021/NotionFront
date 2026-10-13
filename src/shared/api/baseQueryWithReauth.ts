import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { baseQuery } from './baseQuery';
import { refreshAccessToken } from './refreshAccessToken';
import { selectAccessToken } from './sessionSlice';

type ReauthExtraOptions = {
  requiresAuth?: boolean;
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  ReauthExtraOptions
> = async (args, api, extraOptions) => {
  const session = (api.getState() as Parameters<typeof selectAccessToken>[0]).session;
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 || !extraOptions?.requiresAuth) {
    return result;
  }

  const currentState = api.getState() as Parameters<typeof selectAccessToken>[0];
  // Another caller may have already refreshed the token while this request was in flight.
  const accessToken =
    currentState.session !== session
      ? selectAccessToken(currentState)
      : await refreshAccessToken(api);

  return accessToken ? baseQuery(args, api, extraOptions) : result;
};
