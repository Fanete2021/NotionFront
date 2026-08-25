'use client';

import { FC } from 'react';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import styles from './SettingsNav.module.css';
import { settingsNavItems } from './navItems';
import { Typography } from '@/shared/ui/Typography';
import { NavLink } from '@/shared/ui/NavLink';

interface SettingsNavProps {
  className?: string;
}

export const SettingsNav: FC<SettingsNavProps> = ({ className }) => {
  const pathname = usePathname();

  return (
    <nav className={classNames(styles.nav, className)} aria-label="Разделы настроек">
      <Typography variant="text-regular" className={styles.title}>
        Настройки
      </Typography>

      <ul className={styles.list}>
        {settingsNavItems.map(({ id, title, href, icon: Icon }) => (
          <li key={id}>
            <NavLink href={href} active={pathname === href} addonLeft={<Icon />}>
              {title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
