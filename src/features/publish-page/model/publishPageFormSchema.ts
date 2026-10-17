import { z } from 'zod';

export const publishPageFormSchema = z.object({
  isPublic: z.boolean(),
  title: z.string().trim().min(1, 'Введите заголовок страницы').max(120, 'Не больше 120 символов'),
  description: z.string().trim().max(160, 'Не больше 160 символов'),
  slug: z
    .string()
    .trim()
    .min(1, 'Введите URL-slug')
    .max(100, 'Не больше 100 символов')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Используйте строчные латинские буквы, цифры и дефисы между словами',
    ),
});

export type PublishPageFormValues = z.infer<typeof publishPageFormSchema>;
