import { UploadErrorReason } from '../model/attachment.types';

export class AttachmentUploadError extends Error {
  readonly reason: UploadErrorReason;

  constructor(reason: UploadErrorReason) {
    super(reason);
    this.name = 'AttachmentUploadError';
    this.reason = reason;
  }
}
