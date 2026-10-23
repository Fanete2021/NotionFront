import * as z from 'zod';

export const createInviteLinkFormSchema = z.object({
  type: z.enum(['PERMANENT', 'TEMPORARY']),
});

export type CreateInviteLinkFormValues = z.infer<typeof createInviteLinkFormSchema>;
