import {
  CreateWorkspaceInviteDto,
  WorkspaceInviteEntity,
  WorkspaceInviteSummaryEntity,
  RedeemWorkspaceInviteDto,
  WorkspaceMember,
} from '../model/workspaceInvite.types';
import { baseApi } from '@/shared/api/baseApi';

export const workspaceInviteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWorkspaceInvite: builder.mutation<
      WorkspaceInviteEntity,
      { workspaceId: string; data: CreateWorkspaceInviteDto }
    >({
      query: ({ workspaceId, data }) => ({
        url: `/workspaces/${workspaceId}/invites`,
        method: 'POST',
        body: data,
        extraOptions: { requiresAuth: true },
      }),
      invalidatesTags: ['WorkspaceInvite'],
    }),

    getWorkspaceInvites: builder.query<WorkspaceInviteSummaryEntity[], string>({
      query: (workspaceId) => ({
        url: `/workspaces/${workspaceId}/invites`,
        method: 'GET',
        extraOptions: { requiresAuth: true },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'WorkspaceInvite' as const, id })),
              { type: 'WorkspaceInvite', id: 'LIST' },
            ]
          : [{ type: 'WorkspaceInvite', id: 'LIST' }],
    }),

    revokeWorkspaceInvite: builder.mutation<void, { workspaceId: string; inviteId: string }>({
      query: ({ workspaceId, inviteId }) => ({
        url: `/workspaces/${workspaceId}/invites/${inviteId}`,
        method: 'DELETE',
        extraOptions: { requiresAuth: true },
      }),
      invalidatesTags: (result, error, { inviteId }) => [
        { type: 'WorkspaceInvite', id: inviteId },
        { type: 'WorkspaceInvite', id: 'LIST' },
      ],
    }),

    redeemWorkspaceInvite: builder.mutation<WorkspaceMember, RedeemWorkspaceInviteDto>({
      query: (data) => ({
        url: '/invites/redeem',
        method: 'POST',
        body: data,
        extraOptions: { requiresAuth: true },
      }),
      invalidatesTags: ['WorkspaceInvite', 'WorkspaceMember'],
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
