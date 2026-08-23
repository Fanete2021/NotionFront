import { SettingsNavItem } from '../types/settingsNavItem';
import PersonIcon from '@/shared/assets/icons/person.svg';
import BellIcon from '@/shared/assets/icons/not-ring.svg';
import PlugIcon from '@/shared/assets/icons/plug.svg';
import PaletteIcon from '@/shared/assets/icons/palette.svg';
import ShieldIcon from '@/shared/assets/icons/shield.svg';
import CardIcon from '@/shared/assets/icons/card.svg';

export const settingsNavItems: SettingsNavItem[] = [
  {
    id: 'profile',
    title: 'Профиль',
    href: '/profile',
    icon: PersonIcon,
  },
  {
    id: 'notifications',
    title: 'Уведомления',
    href: '/notifications',
    icon: BellIcon,
  },
  {
    id: 'integrations',
    title: 'Интеграции',
    href: '/integrations',
    icon: PlugIcon,
  },
  {
    id: 'appearance',
    title: 'Внешний вид',
    href: '/appearance',
    icon: PaletteIcon,
  },
  {
    id: 'security',
    title: 'Безопасность',
    href: '/security',
    icon: ShieldIcon,
  },
  {
    id: 'billing',
    title: 'Оплата',
    href: '/billing',
    icon: CardIcon,
  },
];
