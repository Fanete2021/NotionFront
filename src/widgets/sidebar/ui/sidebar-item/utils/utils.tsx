import { SidebarItemData } from '../../../model';
import { getIconByName } from '@/shared/ui/icon-picker';

const BASE_PADDING = 16;
const LEVEL_OFFSET = 0;
const MIN_PADDING = 4;

export function getPadding(level: number) {
  return Math.max(MIN_PADDING, BASE_PADDING + level * LEVEL_OFFSET);
}

export function isActiveLink(pathname: string | null, href?: string) {
  if (!pathname || !href || href === '#') return false;
  if (href === '/') return pathname === '/';

  return pathname === href || pathname.startsWith(`${href}/`);
}

export const renderIcon = (item: SidebarItemData, styles: Record<string, string>) => {
  if (!item.icon) return null;

  const style = item.color ? { color: item.color } : undefined;

  const Icon = getIconByName(item.icon);
  return Icon ? <Icon className={styles.icon} style={style} /> : null;
};
