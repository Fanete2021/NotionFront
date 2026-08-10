import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyZTkwM2FjNC1lMzBiLTRiZTYtOGYwNy05YzhlZmQzMTU5OTEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODYzOTU3MDIsImV4cCI6MTc4NjM5NjYwMn0.T5WQmzzqTxTYZz3yqcfeUYafA5s0222z21euG59vs-A';

export const rtkApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    prepareHeaders: (headers) => {
      const token = ACCESS_TOKEN;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Workspace', 'Project'],
  endpoints: () => ({}),
});
