import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import { baseQuery } from './baseQuery';
import { loggedOut, selectAccessToken, setAccessToken } from './sessionSlice';

type RefreshContext = Pick<BaseQueryApi, 'dispatch' | 'getState'>;

type RefreshData = {
  accessToken: string;
};

const isRefreshData = (data: unknown): data is RefreshData =>
  typeof data === 'object' &&
  data !== null &&
  'accessToken' in data &&
  typeof data.accessToken === 'string' &&
  data.accessToken.length > 0;

// HTTP and socket callers share a refresh within the same Redux store.
const pendingRefreshes = new WeakMap<RefreshContext['dispatch'], Promise<string | null>>();

export const refreshAccessToken = ({
  dispatch,
  getState,
}: RefreshContext): Promise<string | null> => {
  const pendingRefresh = pendingRefreshes.get(dispatch);

  if (pendingRefresh) {
    return pendingRefresh;
  }

  const refresh = async (): Promise<string | null> => {
    const session = (getState() as Parameters<typeof selectAccessToken>[0]).session;
    // Cancelling one caller must not cancel the refresh shared by other callers.
    const controller = new AbortController();
    const result = await baseQuery(
      { url: 'auth/refresh', method: 'POST' },
      {
        dispatch,
        getState,
        signal: controller.signal,
        abort: () => controller.abort(),
        extra: undefined,
        endpoint: 'refreshAccessToken',
        type: 'mutation',
      },
      {},
    );

    const currentState = getState() as Parameters<typeof selectAccessToken>[0];

    // A completed refresh must not overwrite a login or logout that happened while it ran.
    if (currentState.session !== session) {
      return selectAccessToken(currentState);
    }

    if (!result.error && isRefreshData(result.data)) {
      dispatch(setAccessToken(result.data.accessToken));
      return result.data.accessToken;
    }

    if (result.error?.status === 401 || result.error?.status === 403) {
      dispatch(loggedOut());
    } else {
      console.error('[auth] refresh failed:', result.error ?? 'Invalid refresh response');
    }

    return null;
  };

  const promise = refresh().finally(() => {
    pendingRefreshes.delete(dispatch);
  });

  pendingRefreshes.set(dispatch, promise);
  return promise;
};
