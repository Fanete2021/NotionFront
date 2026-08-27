import { Workspace, CreateWorkspaceDto, UpdateWorkspaceDto } from '../model/workspace.types';
import { baseApi } from '@/shared/api/baseApi';

export const workspaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaces: builder.query<Workspace[], void>({
      query: () => ({
        url: '/workspaces',
        extraOptions: { requiresAuth: true },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Workspace' as const, id })),
              { type: 'Workspace', id: 'LIST' },
            ]
          : [{ type: 'Workspace', id: 'LIST' }],
    }),

    getWorkspaceById: builder.query<Workspace, string>({
      query: (id) => ({
        url: `/workspaces/${id}`,
        extraOptions: { requiresAuth: true },
      }),
      providesTags: (result, error, id) => [{ type: 'Workspace', id }],
    }),

    createWorkspace: builder.mutation<Workspace, CreateWorkspaceDto>({
      query: (body) => ({
        url: '/workspaces',
        method: 'POST',
        body,
        extraOptions: { requiresAuth: true },
      }),
      invalidatesTags: [{ type: 'Workspace', id: 'LIST' }],
    }),

    updateWorkspace: builder.mutation<Workspace, { id: string; data: UpdateWorkspaceDto }>({
      query: ({ id, data }) => ({
        url: `/workspaces/${id}`,
        method: 'PATCH',
        body: data,
        extraOptions: { requiresAuth: true },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Workspace', id },
        { type: 'Workspace', id: 'LIST' },
      ],
    }),

    deleteWorkspace: builder.mutation<void, string>({
      query: (id) => ({
        url: `/workspaces/${id}`,
        method: 'DELETE',
        extraOptions: { requiresAuth: true },
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Workspace', id },
        { type: 'Workspace', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} = workspaceApi;
