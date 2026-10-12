export const ATTACHMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
} as const;

export type AttachmentStatus = (typeof ATTACHMENT_STATUS)[keyof typeof ATTACHMENT_STATUS];

export const ATTACHMENT_CONTENT_TYPES: readonly string[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

export const UPLOAD_ERROR_REASON = {
  UNSUPPORTED_TYPE: 'UNSUPPORTED_TYPE',
  TOO_LARGE: 'TOO_LARGE',
  ABORTED: 'ABORTED',
  FAILED: 'FAILED',
} as const;

export type UploadErrorReason = (typeof UPLOAD_ERROR_REASON)[keyof typeof UPLOAD_ERROR_REASON];

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
