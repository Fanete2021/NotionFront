import * as z from 'zod';

const timePattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
const timeErrorMessage = 'Время должно быть в формате ЧЧ:ММ (например, 14:30)';

export const changeTelegramNotificationSettingsFormSchema = z
  .object({
    isConnected: z.boolean().default(false),
    eventReminders: z.boolean().default(false),
    dailySummary: z.boolean().default(false),
    taskUpdates: z.boolean().default(false),
    scheduleConflicts: z.boolean().default(false),
    quietHours: z.boolean().default(false),
    reminderMinutes: z.enum(['5', '15', '30', '60']),
    quietHoursStart: z.string(),
    quietHoursEnd: z.string(),
  })
  .refine((values) => !values.quietHours || timePattern.test(values.quietHoursStart), {
    message: timeErrorMessage,
    path: ['quietHoursStart'],
  })
  .refine((values) => !values.quietHours || timePattern.test(values.quietHoursEnd), {
    message: timeErrorMessage,
    path: ['quietHoursEnd'],
  });

export type TelegramNotificationSettingsFormInput = z.input<
  typeof changeTelegramNotificationSettingsFormSchema
>;

export type TelegramNotificationSettingsFormValues = z.infer<
  typeof changeTelegramNotificationSettingsFormSchema
>;
