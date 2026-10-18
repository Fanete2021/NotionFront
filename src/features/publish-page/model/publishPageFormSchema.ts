import { z } from 'zod';

export const publishPageFormSchema = z.object({
  title: z.string().trim().min(1, 'Введите заголовок страницы').max(120, 'Не больше 120 символов'),
  description: z.string().trim().max(160, 'Не больше 160 символов'),
});

export type PublishPageFormValues = z.infer<typeof publishPageFormSchema>;
