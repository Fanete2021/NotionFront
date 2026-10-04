import { attachmentApi } from './api/attachmentApi';

export const { usePresignAttachmentMutation, useConfirmAttachmentMutation } = attachmentApi;

export { useUploadAttachment } from './lib/useUploadAttachment';
export { AttachmentUploadError } from './model/AttachmentUploadError';

export {
  ATTACHMENT_STATUS,
  ATTACHMENT_CONTENT_TYPES,
  UPLOAD_ERROR_REASON,
} from './model/attachment.types';

export type {
  Attachment,
  AttachmentStatus,
  UploadErrorReason,
  PresignAttachmentDto,
  PresignAttachmentResult,
} from './model/attachment.types';
