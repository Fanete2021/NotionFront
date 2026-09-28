import * as z from 'zod';

export const changeTelegramNotificationSettingsFormSchema = z.object({
  isConnected: z.boolean().default(false),
  eventReminders: z.boolean().default(false),
  dailySummary: z.boolean().default(false),
  taskUpdates: z.boolean().default(false),
  scheduleConflicts: z.boolean().default(false),
  quietHours: z.boolean().default(false),
  reminderMinutes: z.enum(['5, 15, 30, 60']).optional(),
  quietHoursStart: z
    .string()
    .min(1, 'Поле не должно быть пустым')
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Время должно быть в формате ЧЧ:ММ (например, 14:30)',
    }),
  quietHoursEnd: z
    .string()
    .min(1, 'Поле не должно быть пустым')
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Время должно быть в формате ЧЧ:ММ (например, 14:30)',
    }),
});

export type TelegramNotificationSettingsFormValues = z.infer<
  typeof changeTelegramNotificationSettingsFormSchema
>;
