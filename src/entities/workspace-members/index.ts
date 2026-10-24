export type { WorkspaceMember, WorkspaceRole } from './model/workspaceMember.types';
export {
  useGetWorkspaceMembersQuery,
  useAddWorkspaceMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
} from './api/workspaceMembersApi';

export { selectChoosedMember } from './model/selectors/selectChoosedMember';
export { selectIsChangeMemberRoleModalOpen } from './model/selectors/selectIsChangeMemberRoleModalOpen';
