import { projectApi } from './api/projectApi';

export const {
  useGetProjectsByWorkspaceQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useReorderProjectsMutation,
} = projectApi;

export type { Project } from './model/project.types';
