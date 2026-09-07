'use client';

import { FC } from 'react';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import styles from './SettingsProfileNav.module.css';
import { settingsNavItems } from '../../model/navItems';
import { Typography } from '@/shared/ui/Typography';
import { NavLink } from '@/shared/ui/nav-link';

interface SettingsProfileNavProps {
  className?: string;
}

export const SettingsProfileNav: FC<SettingsProfileNavProps> = ({ className }) => {
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
