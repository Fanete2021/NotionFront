export interface NotificationSettings {
  isConnected: boolean;
  eventReminders: boolean;
  dailySummary: boolean;
  taskUpdates: boolean;
  scheduleConflicts: boolean;
  reminderMinutes: string;
  quietHours: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export const initialNotificationSettings: NotificationSettings = {
  isConnected: true,
  eventReminders: true,
  dailySummary: true,
  taskUpdates: false,
  scheduleConflicts: true,
  reminderMinutes: '15',
  quietHours: true,
  quietHoursStart: '23:00',
  quietHoursEnd: '08:00',
};

export const notificationTypes = [
  {
    key: 'eventReminders',
    title: 'Напоминания о событиях',
    description: 'Напоминать о событии за указанное время',
  },
  {
    key: 'dailySummary',
    title: 'Ежедневная сводка',
    description: 'Утреннее сообщение с планом дня в 08:00',
  },
  {
    key: 'taskUpdates',
    title: 'Обновления задач',
    description: 'Уведомлять при изменении статуса задачи',
  },
  {
    key: 'scheduleConflicts',
    title: 'Конфликты расписания',
    description: 'Сообщать о пересечении событий по времени',
  },
] as const;

export const reminderOptions = [
  { value: '5', label: 'За 5 минут до события' },
  { value: '15', label: 'За 15 минут до события' },
  { value: '30', label: 'За 30 минут до события' },
  { value: '60', label: 'За 1 час до события' },
];
