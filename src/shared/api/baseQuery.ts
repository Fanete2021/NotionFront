import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { selectAccessToken } from './sessionSlice';

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
  credentials: 'include',

  prepareHeaders: (headers, { getState }) => {
    const accessToken = selectAccessToken(getState() as Parameters<typeof selectAccessToken>[0]);

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  },
});
