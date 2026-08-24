export interface Workspace {
  id: string;
  name: string;
  isPublic: boolean;
  ownerId: string;
  color?: string | null;
  icon?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceDto {
  name: string;
}

export interface UpdateWorkspaceDto {
  name?: string;
  isPublic?: boolean;
  color?: string | null;
  icon?: string | null;
}
