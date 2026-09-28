export interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  emailNotifications: boolean;
  mentionNotifications: boolean;
  telegramToken: string;
  avatarUrl: string;
  avatarFile?: File;
}

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
