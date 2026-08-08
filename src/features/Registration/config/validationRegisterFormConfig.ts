import * as z from 'zod';

const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordRegex =
  /(?=.+[a-z])(?=.+[0-9])(?=.*[A-Z])(?=.+[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}/;

export const registerUserSchema = z
  .object({
    name: z.string().min(1, 'Поле обязательно к заполнению!'),
    surname: z.string().min(1, 'Поле обязательно к заполнению!'),
    email: z
      .string()
      .min(1, 'Поле обязательно к заполнению!')
      .regex(emailRegex, 'Введите корректный email'),
    password: z
      .string()
      .min(1, 'Поле обязательно к заполнению!')
      .regex(
        passwordRegex,
        'Пароль должен содержать заглавные латинские буквы(ABC), спецсимволы (@) и числа',
      ),
    confirmPassword: z.string().min(1, 'Поле обязательно к заполнению!'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают!',
    path: ['confirmPassword'],
  });
