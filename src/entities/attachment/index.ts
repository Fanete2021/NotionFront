import { attachmentApi } from './api/attachmentApi';

export const { usePresignAttachmentMutation, useConfirmAttachmentMutation } = attachmentApi;

export { useUploadAttachment } from './lib/useUploadAttachment';

export { ATTACHMENT_STATUS } from './model/attachment.types';

export type {
  Attachment,
  AttachmentStatus,
  PresignAttachmentDto,
  PresignAttachmentResult,
} from './model/attachment.types';
