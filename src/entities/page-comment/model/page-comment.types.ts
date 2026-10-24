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
  /** Id якоря в тексте. null — комментарий ко всей странице. */
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

export type PageCommentRealtimeAction = 'created' | 'updated' | 'deleted';

/** Событие сокета page:comment. Для deleted поле comment не приходит. */
export interface PageCommentRealtimeEvent {
  pageId: string;
  action: PageCommentRealtimeAction;
  commentId: string;
  actorId: string;
  comment?: PageComment;
}

/** Обсуждение: все комментарии к одному якорю или один комментарий к странице. */
export interface PageCommentThread {
  id: string;
  anchorId: string | null;
  comments: PageComment[];
  resolved: boolean;
}

export const MAX_COMMENT_BODY_LENGTH = 5000;
