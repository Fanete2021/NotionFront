import * as z from 'zod';
import { emailRegex } from '@/shared/lib/regex';

export const profileSettingsSchema = z.object({
  firstName: z.string().min(1, 'Введите имя!'),
  lastName: z.string().min(1, 'Введите фамилию!'),
  email: z.string().min(1, 'Введите email!').regex(emailRegex, 'Введите корректный email'),
  avatarUrl: z.string().trim(),
  avatarFile: z.file().optional(),
});

export type ProfileSettings = z.infer<typeof profileSettingsSchema>;
