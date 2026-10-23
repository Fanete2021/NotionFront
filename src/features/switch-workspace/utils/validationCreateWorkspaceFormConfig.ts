import * as z from 'zod';

export const createWorkspaceFormSchema = z.object({
  name: z.string().trim().min(1, 'Название обязательно'),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceFormSchema>;
