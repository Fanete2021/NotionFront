import {
  Attachment,
  PresignAttachmentDto,
  PresignAttachmentResult,
} from '../model/attachment.types';
import { baseApi } from '@/shared/api';

export const attachmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    presignAttachment: builder.mutation<PresignAttachmentResult, { body: PresignAttachmentDto }>({
      query: ({ body }) => ({
        url: 'attachments/presign',
        method: 'POST',
        body,
      }),
      extraOptions: { requiresAuth: true },
    }),

    confirmAttachment: builder.mutation<Attachment, string>({
      query: (id) => ({
        url: `attachments/${id}/confirm`,
        method: 'POST',
      }),
      extraOptions: { requiresAuth: true },
    }),
  }),
  overrideExisting: false,
});

export const { usePresignAttachmentMutation, useConfirmAttachmentMutation } = attachmentApi;
