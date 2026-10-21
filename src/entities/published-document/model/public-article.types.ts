import type { JSONContent } from '@tiptap/core';
import type { Page } from '@shared/const/pageType';

export type PagePublishType = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export interface PublishPageDto {
  seoTitle: string;
  seoDescription: string;
  status: PagePublishType;
}

export interface PublishPageResponse extends Omit<Page, 'projectId' | 'parentPageId'> {
  projectId?: string | null;
  parentPageId?: string | null;
  slug?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publicationStatus?: PagePublishType | null;
  publishedAt?: string | null;
}

export interface PublicArticleAuthorEntity {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface PublicArticleEntity {
  id: string;
  slug: string;
  title: string;
  icon?: string;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
  updatedAt: string;
  author: PublicArticleAuthorEntity;
}

export interface PublicArticleListEntity {
  items: PublicArticleEntity[];
  nextCursor: string | null;
}

export interface PublicArticleContentEntity {
  json: JSONContent;
  updatedAt: string;
}

export interface PublicArticleDetailEntity extends PublicArticleEntity {
  content: PublicArticleContentEntity;
}

export interface GetPublicArticleParams {
  cursor?: string;
  limit: number;
}
