export type PageType = 'DOC' | 'ARTICLE';

export interface Page {
  id: string;
  workspaceId: string;
  projectId: string | null;
  title: string;
  icon?: string | null;
  type: PageType;
  authorId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageDto {
  title: string;
  workspaceId: string;
  projectId: string;
  icon?: string;
  type?: PageType;
}

export interface UpdatePageDto {
  title?: string;
  icon?: string;
  type?: PageType;
  projectId?: string;
}

export type PageContentJson = Record<string, unknown>;

export interface PageContent {
  pageId: string;
  json: PageContentJson;
  updatedAt: string;
}
