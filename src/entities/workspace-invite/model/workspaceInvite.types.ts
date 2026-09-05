export type InviteType = 'TEMPORARY' | 'PERMANENT';
export type InviteRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface CreateWorkspaceInviteDto {
  type: InviteType;
  role?: InviteRole;
}

export interface WorkspaceInviteEntity {
  token: string;
  url: string;
  type: InviteType;
  role: InviteRole;
  expiresAt: string | null;
}

export interface WorkspaceInviteSummaryEntity {
  id: string;
  workspaceId: string;
  role: InviteRole;
  createdBy: string;
  createdAt: string;
}

export interface RedeemWorkspaceInviteDto {
  token: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: InviteRole;
  createdAt: string;
}
