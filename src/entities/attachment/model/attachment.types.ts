export const ATTACHMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
} as const;

export type AttachmentStatus = (typeof ATTACHMENT_STATUS)[keyof typeof ATTACHMENT_STATUS];

export interface Attachment {
  id: string;
  pageId: string;
  workspaceId: string;
  fileName: string;
  contentType: string;
  size: number;
  status: AttachmentStatus;
  publicUrl: string;
  createdAt: string;
}

export interface PresignAttachmentDto {
  pageId: string;
  fileName: string;
  contentType: string;
  size: number;
}

export interface PresignAttachmentResult {
  attachmentId: string;
  uploadUrl: string;
  method: string;
  headers: Record<string, string>;
}
