export const PAGE_TYPE = {
  DOC: 'DOC',
  ARTICLE: 'ARTICLE',
} as const;

export type PageType = (typeof PAGE_TYPE)[keyof typeof PAGE_TYPE];

export interface Page {
  id: string;
  workspaceId: string;
  projectId: string | null;
  parentPageId: string | null;
  title: string;
  icon?: string | null;
  type: PageType;
  authorId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}
