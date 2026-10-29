export interface PageCommentAuthor {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface PageComment {
  id: string;
  pageId: string;
  body: string;
  anchorId: string | null;
  resolved: boolean;
  resolvedAt: string | null;
  resolvedBy: PageCommentAuthor | null;
  createdAt: string;
  updatedAt: string;
  authorInfo: PageCommentAuthor;
}

export interface CreatePageCommentDto {
  body: string;
  anchorId?: string;
}

export interface PageCommentRealtimeEvent {
  pageId: string;
  action: 'created' | 'updated' | 'deleted';
  commentId: string;
  actorId: string;
  comment?: PageComment;
}

export interface PageCommentThread {
  id: string;
  anchorId: string | null;
  comments: PageComment[];
  resolved: boolean;
  resolvedBy: PageCommentAuthor | null;
}

export const MAX_COMMENT_BODY_LENGTH = 5000;
