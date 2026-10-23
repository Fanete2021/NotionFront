import * as z from 'zod';

export const projectFormSchema = z.object({
  name: z.string().trim().min(1, 'Название проекта обязательно'),
  color: z.string().nullable(),
  icon: z.string().nullable(),
  workspaceId: z.string().min(1, 'Рабочее пространство не выбрано'),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
