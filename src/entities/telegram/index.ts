import { telegramApi } from './api/telegramApi';

export const {
  useGetTelegramStatusQuery,
  useCreateTelegramConnectCodeMutation,
  useDisconnectTelegramMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = telegramApi;

export { REMINDER_MINUTES } from './model/reminderMinutes';

export type {
  TelegramStatus,
  TelegramConnectCode,
  NotificationSettings,
  UpdateNotificationSettingsDto,
} from './model/telegram.types';
