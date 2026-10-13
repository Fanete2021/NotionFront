import {
  CreateWorkspaceInviteDto,
  CreateWorkspaceInviteResult,
  WorkspaceInviteSummary,
  RedeemWorkspaceInviteDto,
  WorkspaceMember,
} from '../model/workspaceInvite.types';
import { baseApi } from '@/shared/api';

export const workspaceInviteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWorkspaceInvite: builder.mutation<
      CreateWorkspaceInviteResult,
      { workspaceId: string; body: CreateWorkspaceInviteDto }
    >({
      query: ({ workspaceId, body }) => ({
        url: `workspaces/${workspaceId}/invites`,
        method: 'POST',
        body,
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { workspaceId }) =>
        error ? [] : [{ type: 'WorkspaceInvite', id: `WORKSPACE_${workspaceId}` }],
    }),

    getWorkspaceInvites: builder.query<WorkspaceInviteSummary[], string>({
      query: (workspaceId) => ({
        url: `workspaces/${workspaceId}/invites`,
        method: 'GET',
      }),
      extraOptions: { requiresAuth: true },
      providesTags: (result, error, workspaceId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'WorkspaceInvite' as const, id })),
              { type: 'WorkspaceInvite', id: `WORKSPACE_${workspaceId}` },
            ]
          : [{ type: 'WorkspaceInvite', id: `WORKSPACE_${workspaceId}` }],
    }),

    revokeWorkspaceInvite: builder.mutation<void, { workspaceId: string; inviteId: string }>({
      query: ({ workspaceId, inviteId }) => ({
        url: `workspaces/${workspaceId}/invites/${inviteId}`,
        method: 'DELETE',
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error, { workspaceId, inviteId }) =>
        error
          ? []
          : [
              { type: 'WorkspaceInvite', id: inviteId },
              { type: 'WorkspaceInvite', id: `WORKSPACE_${workspaceId}` },
            ],
    }),

    redeemWorkspaceInvite: builder.mutation<WorkspaceMember, { body: RedeemWorkspaceInviteDto }>({
      query: ({ body }) => ({
        url: 'invites/redeem',
        method: 'POST',
        body,
      }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: (result, error) =>
        error || !result
          ? []
          : [
              { type: 'WorkspaceInvite', id: `WORKSPACE_${result.workspaceId}` },
              { type: 'WorkspaceMember', id: `WORKSPACE_${result.workspaceId}` },
              { type: 'Workspace', id: 'LIST' },
            ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateWorkspaceInviteMutation,
  useGetWorkspaceInvitesQuery,
  useRevokeWorkspaceInviteMutation,
  useRedeemWorkspaceInviteMutation,
} = workspaceInviteApi;
