import { SettingsNavItem } from './types';

export const SETTINGS_ROOT = '/settings';

export const settingsNavItems: SettingsNavItem[] = [
  {
    id: 'profile',
    title: 'Профиль',
    href: `${SETTINGS_ROOT}/profile`,
  },
];
