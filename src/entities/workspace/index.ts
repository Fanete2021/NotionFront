import { workspaceApi } from '@/entities/workspace/api/workspaceApi';

export const {
  useGetWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} = workspaceApi;

export type { Workspace } from './model/workspace.types';
