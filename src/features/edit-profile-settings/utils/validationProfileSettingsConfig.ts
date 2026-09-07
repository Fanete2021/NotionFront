import * as z from 'zod';
import { emailRegex } from '@/shared/lib/regex';

export const profileSettingsSchema = z.object({
  firstName: z.string().min(1, 'Введите имя!'),
  lastName: z.string().min(1, 'Введите фамилию!'),
  email: z.string().min(1, 'Введите email!').regex(emailRegex, 'Введите корректный email'),
  emailNotifications: z.boolean(),
  mentionNotifications: z.boolean(),
  telegramToken: z.string(),
});
