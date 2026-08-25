'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarItem as SidebarItemType } from '../../../../model';
import styles from './SidebarLink.module.css';
import { getPadding, getChildPadding, isDeepChild, renderIcon } from '../../utils';
import { Typography } from '@/shared/ui/Typography';

interface SidebarLinkProps {
  item: SidebarItemType;
  level: number;
}

export function SidebarLink({ item, level }: SidebarLinkProps) {
  const pathname = usePathname();
  const active = pathname === item.href;
  const deepChild = isDeepChild(level);

  const paddingLeft = deepChild ? getChildPadding(level) : level === 0 ? 8 : getPadding(level);

  return (
    <Link
      href={item.href ?? '#'}
      className={`${styles.link} ${active ? styles.active : ''}`}
      style={{
        paddingInlineStart: paddingLeft,
      }}
    >
      {!deepChild && level > 0 && <span className={styles.arrowPlaceholder} />}
      {!deepChild && renderIcon(item, styles)}
      {!deepChild && item.color && (
        <span className={styles.colorDot} style={{ backgroundColor: item.color }} />
      )}
      <Typography className={styles.title} variant="label">
        {item.title}
      </Typography>
    </Link>
  );
}
