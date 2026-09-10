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
} from './slice/currentWorkspaceSlice';
export type { CurrentWorkspaceState } from './slice/currentWorkspaceSlice';
