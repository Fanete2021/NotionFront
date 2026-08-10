import { SidebarItem } from '@/widgets/Sidebar/model/types/sidebar';
import HomeIcon from '@/shared/assets/icons/home.svg';
import DocsIcon from '@/shared/assets/icons/docs.svg';
import CalendarIcon from '@/shared/assets/icons/calendar.svg';
import TrashIcon from '@/shared/assets/icons/trash-2.svg';
import GearIcon from '@/shared/assets/icons/gear_icon.svg';

export const staticSidebarItems: SidebarItem[] = [
  {
    id: 'home',
    title: 'Главная',
    type: 'link',
    href: '/',
    icon: HomeIcon,
  },
  {
    id: 'documents',
    title: 'Документы',
    type: 'link',
    href: '/documents',
    icon: DocsIcon,
  },
  {
    id: 'divider',
    type: 'divider',
  },
  {
    id: 'projects-section',
    title: 'Проекты',
    type: 'section',
    children: [],
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
