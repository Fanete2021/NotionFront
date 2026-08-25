import {
  WorkspaceMember,
  AddWorkspaceMemberDto,
  UpdateMemberRoleDto,
} from '../model/workspaceMember';
import { baseApi } from '@/shared/api';

export const workspaceMembersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaceMembers: builder.query<WorkspaceMember[], string>({
      query: (workspaceId) => `/workspaces/${workspaceId}/members`,
      providesTags: (result, error, workspaceId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'WorkspaceMember' as const, id })),
              { type: 'WorkspaceMember', id: `WORKSPACE_${workspaceId}` },
            ]
          : [{ type: 'WorkspaceMember', id: `WORKSPACE_${workspaceId}` }],
    }),

    addWorkspaceMember: builder.mutation<
      WorkspaceMember,
      { workspaceId: string; body: AddWorkspaceMemberDto }
    >({
      query: ({ workspaceId, body }) => ({
        url: `/workspaces/${workspaceId}/members`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { workspaceId }) => [
        { type: 'WorkspaceMember', id: `WORKSPACE_${workspaceId}` },
      ],
    }),

    updateMemberRole: builder.mutation<
      WorkspaceMember,
      { workspaceId: string; userId: string; body: UpdateMemberRoleDto }
    >({
      query: ({ workspaceId, userId, body }) => ({
        url: `/workspaces/${workspaceId}/members/${userId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { workspaceId }) => [
        { type: 'WorkspaceMember', id: `WORKSPACE_${workspaceId}` },
      ],
    }),

    removeMember: builder.mutation<void, { workspaceId: string; userId: string }>({
      query: ({ workspaceId, userId }) => ({
        url: `/workspaces/${workspaceId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { workspaceId }) => [
        { type: 'WorkspaceMember', id: `WORKSPACE_${workspaceId}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWorkspaceMembersQuery,
  useAddWorkspaceMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
} = workspaceMembersApi;
