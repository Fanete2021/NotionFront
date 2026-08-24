import { workspaceApi } from './api/workspaceApi';

export const {
  useGetWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} = workspaceApi;

export type { Workspace } from './model/workspace.types';

export {
  currentWorkspaceReducer,
  setCurrentWorkspace,
  clearCurrentWorkspace,
} from './model/currentWorkspaceSlice';
export type { CurrentWorkspaceState } from './model/currentWorkspaceSlice';
