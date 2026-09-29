import { useCallback } from 'react';
import { attachmentApi } from '../api/attachmentApi';

export const useUploadAttachment = (pageId: string) => {
  const [presign] = attachmentApi.usePresignAttachmentMutation();
  const [confirm] = attachmentApi.useConfirmAttachmentMutation();

  return useCallback(
    async (file: File) => {
      const { attachmentId, uploadUrl, method, headers } = await presign({
        pageId,
        fileName: file.name,
        contentType: file.type,
        size: file.size,
      }).unwrap();

      const response = await fetch(uploadUrl, { method, headers, body: file });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const attachment = await confirm(attachmentId).unwrap();

      return attachment.publicUrl;
    },
    [pageId, presign, confirm],
  );
};
