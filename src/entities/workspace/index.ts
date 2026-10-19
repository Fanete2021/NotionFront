export {
  useGetWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} from './api/workspaceApi';

export type { Workspace, CreateWorkspaceDto, UpdateWorkspaceDto } from './model/workspace.types';

export {
  currentWorkspaceReducer,
  setCurrentWorkspace,
  clearCurrentWorkspace,
} from './slice/currentWorkspaceSlice';
export type { CurrentWorkspaceState } from './slice/currentWorkspaceSlice';
