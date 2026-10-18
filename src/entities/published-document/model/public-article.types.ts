import type { JSONContent } from '@tiptap/core';

export type PagePublishType = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export interface PublishPageDto {
  seoTitle?: string;
  seoDescription?: string;
  status: PagePublishType;
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
