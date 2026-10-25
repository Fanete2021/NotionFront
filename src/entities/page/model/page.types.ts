import { Page, PageType } from '@/shared/const/pageType';

export interface SearchPagesParams {
  workspaceId: string;
  q: string;
  type?: 'all' | 'documents' | 'content';
  projectId?: string;
  from?: string;
  to?: string;
  limit?: number;
}

export interface PageSearchResult extends Pick<
  Page,
  'workspaceId' | 'title' | 'type' | 'updatedAt' | 'icon'
> {
  pageId: string;
  projectId?: string | null;
  parentPageId?: string | null;
  matchedIn: 'title' | 'content';
  snippet?: string | null;
  matchOffset?: number | null;
  path: { type: 'project' | 'page'; id: string; name: string }[];
}

export interface ReorderPagesDto {
  projectId: string;
  orderedIds: string[];
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
  label: string | null;
  createdAt: string;
  preview: string;
}

export interface PageVersionList {
  items: PageVersion[];
  nextCursor: string | null;
}

export interface UserPageData {
  id: string;
  name: string;
  avatar?: string | null;
}

export type PageJoinResponse =
  | {
      ok: true;
      users: UserPageData[];
      canEdit: boolean;
    }
  | {
      ok: false;
    };

export interface PagePresenceData {
  pageId: string;
  users: UserPageData[];
}

export type PageLeaveResponse = {
  ok: true;
};

export interface RestorePageVersionDto {
  versionId: string;
  pageId: string;
}
