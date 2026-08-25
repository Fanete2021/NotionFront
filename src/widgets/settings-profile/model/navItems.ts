import { SettingsNavItem } from './types';
import PersonIcon from '@/shared/assets/icons/person.svg';
import BellIcon from '@/shared/assets/icons/not-ring.svg';
import PlugIcon from '@/shared/assets/icons/plug.svg';
import PaletteIcon from '@/shared/assets/icons/palette.svg';
import ShieldIcon from '@/shared/assets/icons/shield.svg';
import CardIcon from '@/shared/assets/icons/card.svg';

export const SETTINGS_ROOT = '/settings';

export const settingsNavItems: SettingsNavItem[] = [
  {
    id: 'profile',
    title: 'Профиль',
    href: `${SETTINGS_ROOT}/profile`,
    icon: PersonIcon,
  },
  {
    id: 'notifications',
    title: 'Уведомления',
    href: `${SETTINGS_ROOT}/notifications`,
    icon: BellIcon,
  },
  {
    id: 'integrations',
    title: 'Интеграции',
    href: `${SETTINGS_ROOT}/integrations`,
    icon: PlugIcon,
  },
  {
    id: 'appearance',
    title: 'Внешний вид',
    href: `${SETTINGS_ROOT}/appearance`,
    icon: PaletteIcon,
  },
  {
    id: 'security',
    title: 'Безопасность',
    href: `${SETTINGS_ROOT}/security`,
    icon: ShieldIcon,
  },
  {
    id: 'billing',
    title: 'Оплата',
    href: `${SETTINGS_ROOT}/billing`,
    icon: CardIcon,
  },
];
