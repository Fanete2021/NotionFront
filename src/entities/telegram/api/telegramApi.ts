import {
  NotificationSettings,
  TelegramConnectCode,
  TelegramStatus,
  UpdateNotificationSettingsDto,
} from '../model/telegram.types';
import { baseApi } from '@/shared/api';

export const telegramApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTelegramStatus: builder.query<TelegramStatus, void>({
      query: () => ({ url: '/telegram/status' }),
      extraOptions: { requiresAuth: true },
      providesTags: ['TelegramStatus'],
    }),

    createTelegramConnectCode: builder.mutation<TelegramConnectCode, void>({
      query: () => ({ url: '/telegram/connect-code', method: 'POST' }),
      extraOptions: { requiresAuth: true },
    }),

    disconnectTelegram: builder.mutation<void, void>({
      query: () => ({ url: '/telegram/disconnect', method: 'DELETE' }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: ['TelegramStatus'],
    }),

    getNotificationSettings: builder.query<NotificationSettings, void>({
      query: () => ({ url: '/notifications/settings' }),
      extraOptions: { requiresAuth: true },
      providesTags: ['NotificationSettings'],
    }),

    updateNotificationSettings: builder.mutation<
      NotificationSettings,
      UpdateNotificationSettingsDto
    >({
      query: (body) => ({ url: '/notifications/settings', method: 'PATCH', body }),
      extraOptions: { requiresAuth: true },
      invalidatesTags: ['NotificationSettings'],
    }),
  }),
});
