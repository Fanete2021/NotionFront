'use client';

import { usePathname } from 'next/navigation';
import { SidebarItem as SidebarItemType } from '../../../../model';
import styles from './SidebarLink.module.css';
import { getPadding, getChildPadding, isDeepChild, isActiveLink, renderIcon } from '../../utils';
import { NavLink } from '@/shared/ui/nav-link';

interface SidebarLinkProps {
  item: SidebarItemType;
  level: number;
}

export function SidebarLink({ item, level }: SidebarLinkProps) {
  const pathname = usePathname();
  const active = isActiveLink(pathname, item.href);
  const deepChild = isDeepChild(level);

  const paddingLeft = deepChild ? getChildPadding(level) : level === 0 ? 8 : getPadding(level);

  const icon = deepChild ? null : renderIcon(item, styles);
  const withArrowPlaceholder = !deepChild && level > 0;
  const withColorDot = !deepChild && Boolean(item.color);
  const withAddons = withArrowPlaceholder || Boolean(icon) || withColorDot;

  return (
    <NavLink
      href={item.href ?? '#'}
      className={styles.link}
      active={active}
      size="sm"
      labelVariant="text-regular"
      style={{
        paddingInlineStart: paddingLeft,
      }}
      addonLeft={
        withAddons ? (
          <span className={styles.addons}>
            {withArrowPlaceholder && <span className={styles.arrowPlaceholder} />}
            {icon}
            {withColorDot && (
              <span className={styles.colorDot} style={{ backgroundColor: item.color }} />
            )}
          </span>
        ) : undefined
      }
    >
      {item.title}
    </NavLink>
  );
}
