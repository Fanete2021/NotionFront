import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyZTkwM2FjNC1lMzBiLTRiZTYtOGYwNy05YzhlZmQzMTU5OTEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODYzNTU2NjcsImV4cCI6MTc4NjM1NjU2N30.0cCGmAQdEMLAqSPdw47tJRVjH_TB9pXgfEwet1dyI54';

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
