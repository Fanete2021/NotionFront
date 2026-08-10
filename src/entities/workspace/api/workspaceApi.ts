import { Workspace, CreateWorkspaceDto, UpdateWorkspaceDto } from '../model/workspace.types';
import { rtkApi } from '@/shared/api/rtkApi';

export const workspaceApi = rtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaces: builder.query<Workspace[], void>({
      query: () => '/workspaces',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Workspace' as const, id })),
              { type: 'Workspace', id: 'LIST' },
            ]
          : [{ type: 'Workspace', id: 'LIST' }],
    }),

    getWorkspaceById: builder.query<Workspace, string>({
      query: (id) => `/workspaces/${id}`,
      providesTags: (result, error, id) => [{ type: 'Workspace', id }],
    }),

    createWorkspace: builder.mutation<Workspace, CreateWorkspaceDto>({
      query: (body) => ({
        url: '/workspaces',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Workspace', id: 'LIST' }],
    }),

    updateWorkspace: builder.mutation<Workspace, { id: string; data: UpdateWorkspaceDto }>({
      query: ({ id, data }) => ({
        url: `/workspaces/${id}`,
        method: 'PATCH',
        body: data,
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
