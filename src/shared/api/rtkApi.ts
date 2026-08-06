import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyZTkwM2FjNC1lMzBiLTRiZTYtOGYwNy05YzhlZmQzMTU5OTEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODU5NjYxMDcsImV4cCI6MTc4NTk2NzAwN30.fNI5OzYU_Ez7jJtZztw9RXPlwFKKDalRy5Q-ueb7vGs';

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
