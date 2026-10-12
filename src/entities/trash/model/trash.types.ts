import type { PageType } from '@shared/const/pageType';

export interface TrashedPageAuthor {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface TrashedPage {
  id: string;
  workspaceId: string;
  projectId: string | null;
  title: string;
  icon?: string | null;
  type: PageType;
  author: TrashedPageAuthor;
  deletedAt: string;
  deletedBy: TrashedPageAuthor | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmptyTrashResult {
  deleted: number;
}

export interface GetTrashParams {
  workspaceId: string | null;
  q?: string;
}
