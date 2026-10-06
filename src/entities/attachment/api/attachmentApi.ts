import {
  Attachment,
  PresignAttachmentDto,
  PresignAttachmentResult,
} from '../model/attachment.types';
import { baseApi } from '@/shared/api/baseApi';

export const attachmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    presignAttachment: builder.mutation<PresignAttachmentResult, PresignAttachmentDto>({
      query: (body) => ({
        url: '/attachments/presign',
        method: 'POST',
        body,
      }),
      extraOptions: { requiresAuth: true },
    }),

    confirmAttachment: builder.mutation<Attachment, string>({
      query: (id) => ({
        url: `/attachments/${id}/confirm`,
        method: 'POST',
      }),
      extraOptions: { requiresAuth: true },
    }),
  }),
  overrideExisting: false,
});
