import { ComponentType } from 'react';
import { SidebarItemData } from '../../../model';
import styles from './utils.module.css';
import { getIconByName } from '@/shared/ui/icon-picker';

const BASE_PADDING = 8;
const LEVEL_OFFSET = 24;
const MIN_PADDING = 4;

export function getPadding(level: number) {
  return Math.max(MIN_PADDING, BASE_PADDING + level * LEVEL_OFFSET);
}

export function isActiveLink(pathname: string | null, href?: string) {
  if (!pathname || !href || href === '#') return false;
  if (href === '/') return pathname === '/';

  return pathname === href || pathname.startsWith(`${href}/`);
}

type IconComponent = ComponentType<{ className?: string }>;

export const renderIcon = (item: SidebarItemData) => {
  if (!item.icon) return null;

  if (typeof item.icon !== 'string') {
    const Icon = item.icon as IconComponent;
    return <Icon className={styles.icon} />;
  }

  const IconFromMap = getIconByName(item.icon);
  if (IconFromMap) {
    return <IconFromMap className={styles.icon} />;
  }

  return <span className={styles.icon}>{item.icon}</span>;
};
