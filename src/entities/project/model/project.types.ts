export interface Project {
  id: string;
  name: string;
  workspaceId: string;
  parentProjectId?: string | null;
  color?: string | null;
  icon?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  parentProjectId?: string;
  color?: string;
  icon?: string;
}

export interface UpdateProjectDto {
  name?: string;
  parentProjectId?: string | null;
  color?: string;
  icon?: string;
}

export interface ReorderProjectsDto {
  parentProjectId?: string | null;
  orderedIds: string[];
}
