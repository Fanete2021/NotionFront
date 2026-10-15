import type { ProfileSettings } from '../utils/validationProfileSettingsConfig';

export const defaultProfileSettings: ProfileSettings = {
  firstName: 'Алекс',
  lastName: 'Ким',
  email: 'alex@acme.io',
  emailNotifications: true,
  mentionNotifications: true,
  telegramToken: '',
  avatarUrl: 'https://example.com/avatar.jpg',
  avatarFile: undefined,
};
