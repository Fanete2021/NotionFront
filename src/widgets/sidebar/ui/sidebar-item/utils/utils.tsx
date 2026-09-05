import { SidebarItem } from '../../../model';
import { getProjectIcon } from '@/shared/ui/IconPicker';

const BASE_PADDING = 16;
const LEVEL_OFFSET = 8;
const CHILD_LINK_OFFSET = 37;

export function getPadding(level: number) {
  return BASE_PADDING + level * LEVEL_OFFSET;
}

export function getChildPadding(level: number) {
  return getPadding(level) + CHILD_LINK_OFFSET;
}

export function isDeepChild(level: number) {
  return level >= 2;
}

export function isActiveLink(pathname: string | null, href?: string) {
  if (!pathname || !href || href === '#') return false;
  if (href === '/') return pathname === '/';

  return pathname === href || pathname.startsWith(`${href}/`);
}

export const renderIcon = (item: SidebarItem, styles: Record<string, string>) => {
  if (!item.icon) return null;

  if (typeof item.icon === 'string') {
    const ProjectIcon = getProjectIcon(item.icon);
    if (ProjectIcon) {
      return <ProjectIcon className={styles.icon} />;
    }

    // у проектов, созданных раньше, в icon лежит эмодзи
    return <span className={styles.icon}>{item.icon}</span>;
  }

  const IconComponent = item.icon;
  return <IconComponent className={styles.icon} />;
};
