import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@shared/api/baseQueryWithReauth';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Session'],
  endpoints: () => ({}),
});
