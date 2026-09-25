import * as z from 'zod';

export const createCalendarEventFormSchema = z.object({
  title: z.string().trim().min(1, 'Название для события обязательно'),
  date: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.date({ message: 'Обязательное поле' }),
  ),
  startTime: z
    .string()
    .min(1, 'Поле не должно быть пустым')
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Время должно быть в формате ЧЧ:ММ (например, 14:30)',
    }),
  endTime: z
    .string()
    .min(1, 'Поле не должно быть пустым')
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Время должно быть в формате ЧЧ:ММ (например, 14:30)',
    }),
  project: z.string().trim().min(1, 'Выберите элемент из списка'),
  taskType: z.string().trim().min(1, 'Выберите элемент из списка'),
  repeatable: z.string().trim().min(1, 'Выберите элемент из списка'),
  notifications: z.boolean().default(false),
  telegramSend: z.boolean().default(false),
});

export type CreateCalendarEventFormValues = z.infer<typeof createCalendarEventFormSchema>;
