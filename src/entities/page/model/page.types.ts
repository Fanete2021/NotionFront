import { PageType } from '@/shared/const/pageType';

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
