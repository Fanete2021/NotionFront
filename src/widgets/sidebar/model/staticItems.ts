import { SidebarItem } from './types/sidebar';
import HomeIcon from '@/shared/assets/icons/home.svg';
import CalendarIcon from '@/shared/assets/icons/calendar.svg';
import TrashIcon from '@/shared/assets/icons/trash-2.svg';
import GearIcon from '@/shared/assets/icons/gear-icon-2.svg';

export const staticSidebarItems: SidebarItem[] = [
  {
    id: 'home',
    title: 'Главная',
    type: 'link',
    href: '/main',
    icon: HomeIcon,
  },
  {
    id: 'projects-section',
    title: 'Проекты',
    type: 'section',
    children: [],
  },
  {
    id: 'divider',
    type: 'divider',
  },
  {
    id: 'calendar',
    title: 'Календарь',
    type: 'link',
    href: '/calendar',
    icon: CalendarIcon,
  },
  {
    id: 'trash',
    title: 'Корзина',
    type: 'link',
    href: '/trash',
    icon: TrashIcon,
  },
  {
    id: 'settings',
    title: 'Настройки',
    type: 'link',
    href: '/settings',
    icon: GearIcon,
  },
];
