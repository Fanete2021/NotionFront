import { useCallback } from 'react';
import { attachmentApi } from '../api/attachmentApi';
import { ATTACHMENT_CONTENT_TYPES, UPLOAD_ERROR_REASON } from '../model/attachment.types';
import { AttachmentUploadError } from '../model/AttachmentUploadError';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { isFetchBaseQueryError } from '@/shared/utils/error-utils';

const getReasonByStatus = (status: unknown) =>
  status === HTTP_STATUS.PAYLOAD_TOO_LARGE
    ? UPLOAD_ERROR_REASON.TOO_LARGE
    : UPLOAD_ERROR_REASON.FAILED;

const toUploadError = (error: unknown, signal?: AbortSignal) => {
  if (error instanceof AttachmentUploadError) return error;
  if (signal?.aborted) return new AttachmentUploadError(UPLOAD_ERROR_REASON.ABORTED);
  if (isFetchBaseQueryError(error)) {
    return new AttachmentUploadError(getReasonByStatus(error.status));
  }

  return new AttachmentUploadError(UPLOAD_ERROR_REASON.FAILED);
};

export const useUploadAttachment = (pageId: string) => {
  const [presign] = attachmentApi.usePresignAttachmentMutation();
  const [confirm] = attachmentApi.useConfirmAttachmentMutation();

  return useCallback(
    async (file: File, signal?: AbortSignal) => {
      if (!ATTACHMENT_CONTENT_TYPES.includes(file.type)) {
        throw new AttachmentUploadError(UPLOAD_ERROR_REASON.UNSUPPORTED_TYPE);
      }

      try {
        const { attachmentId, uploadUrl, method, headers } = await presign({
          pageId,
          fileName: file.name,
          contentType: file.type,
          size: file.size,
        }).unwrap();

        signal?.throwIfAborted();

        const response = await fetch(uploadUrl, { method, headers, body: file, signal });

        if (!response.ok) {
          throw new AttachmentUploadError(getReasonByStatus(response.status));
        }

        signal?.throwIfAborted();

        const attachment = await confirm(attachmentId).unwrap();

        return attachment.publicUrl;
      } catch (error) {
        throw toUploadError(error, signal);
      }
    },
    [pageId, presign, confirm],
  );
};
