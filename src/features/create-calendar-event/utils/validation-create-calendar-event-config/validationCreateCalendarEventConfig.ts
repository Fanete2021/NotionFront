import * as z from 'zod';
import { REMINDER_MINUTES } from '@entities/telegram';

const parseLocalDate = (val: unknown): Date | undefined => {
  if (val instanceof Date) return val;

  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const [y, m, d] = val.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  if (typeof val === 'string' && val.trim() !== '') {
    const parsed = new Date(val);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }

  return undefined;
};

export const createCalendarEventFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Название для события обязательно'),
    date: z.preprocess(
      (val) => (val === '' || val === null ? undefined : parseLocalDate(val)),
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
    project: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v === '' ? undefined : v)),
    taskType: z.string().trim().min(1, 'Выберите элемент из списка'),
    repeatable: z.string().trim().min(1, 'Выберите элемент из списка'),
    reminderMinutes: z.enum(REMINDER_MINUTES).default('15').transform(Number),
    telegramReminder: z.boolean().default(false),
  })
  .refine((values) => values.endTime > values.startTime, {
    message: 'Время окончания должно быть позже начала',
    path: ['endTime'],
  });

export type CreateCalendarEventFormInput = z.input<typeof createCalendarEventFormSchema>;
export type CreateCalendarEventFormOutput = z.output<typeof createCalendarEventFormSchema>;
