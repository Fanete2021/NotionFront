export interface TelegramStatus {
  isConnected: boolean;
  username: string | null;
  connectedAt: string | null;
}

export interface TelegramConnectCode {
  code: string;
  deepLink: string;
  expiresAt: string;
}

export interface NotificationSettings {
  eventReminders: boolean;
  dailySummary: boolean;
  taskUpdates: boolean;
  scheduleConflicts: boolean;
  reminderMinutes: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
}

export type UpdateNotificationSettingsDto = Partial<NotificationSettings>;
