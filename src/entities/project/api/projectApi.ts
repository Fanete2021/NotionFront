import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  ReorderProjectsDto,
} from '../model/project.types';
import { baseApi } from '@/shared/api/baseApi';

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectsByWorkspace: builder.query<Project[], string>({
      query: (workspaceId) => `/workspaces/${workspaceId}/projects`,
      providesTags: (result, error, workspaceId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Project' as const, id })),
              { type: 'Project', id: `WORKSPACE_${workspaceId}` },
            ]
          : [{ type: 'Project', id: `WORKSPACE_${workspaceId}` }],
    }),

    getProjectById: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),

    createProject: builder.mutation<Project, { workspaceId: string; data: CreateProjectDto }>({
      query: ({ workspaceId, data }) => ({
        url: `/workspaces/${workspaceId}/projects`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { workspaceId }) => [
        { type: 'Project', id: `WORKSPACE_${workspaceId}` },
      ],
    }),

    updateProject: builder.mutation<Project, { id: string; data: UpdateProjectDto }>({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
      ],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
      ],
    }),

    reorderProjects: builder.mutation<Project[], { workspaceId: string; data: ReorderProjectsDto }>(
      {
        query: ({ workspaceId, data }) => ({
          url: `/workspaces/${workspaceId}/projects/order`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: (result, error, { workspaceId }) => [
          { type: 'Project', id: `WORKSPACE_${workspaceId}` },
        ],
      },
    ),
  }),
  overrideExisting: false,
});

export const {
  useGetProjectsByWorkspaceQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useReorderProjectsMutation,
} = projectApi;
