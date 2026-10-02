export const PAGE_TYPE = {
  DOC: 'DOC',
  ARTICLE: 'ARTICLE',
} as const;

export type PageType = (typeof PAGE_TYPE)[keyof typeof PAGE_TYPE];

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
  icon?: string | null;
  type?: PageType;
  projectId?: string;
}

export type PageContentJson = Record<string, unknown>;

export interface PageContent {
  pageId: string;
  json: PageContentJson;
  updatedAt: string;
}

export interface PageVersion {
  id: string;
  pageId: string;
  authorId: string;
  label: string;
  createdAt: string;
}

export interface PageVersionList {
  items: PageVersion[];
  nextCursor: string | null;
}
