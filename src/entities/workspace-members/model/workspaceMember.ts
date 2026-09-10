export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface WorkspaceMember {
  id: string;
  role: WorkspaceRole;
  createdAt: string;
  userInfo: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export interface AddWorkspaceMemberDto {
  userId: string;
  role?: WorkspaceRole;
}

export interface UpdateMemberRoleDto {
  role: WorkspaceRole;
}
