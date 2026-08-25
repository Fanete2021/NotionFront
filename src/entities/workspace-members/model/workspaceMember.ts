export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER' | 'MEMBER';

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  createdAt: string;
  user?: {
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
