import * as z from 'zod';
import { emailRegex } from '@shared/lib';

export const loginUserSchema = z.object({
  email: z.string().min(1, 'Введите email!').regex(emailRegex, 'Введите корректный email'),
  password: z.string().min(1, 'Введите пароль!'),
});
