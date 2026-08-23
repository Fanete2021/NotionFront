'use client';

import { FC } from 'react';
import classNames from 'classnames';
import styles from './SettingsNav.module.css';
import { settingsNavItems } from '../model/consts/navItems';
import { SettingsSection } from '../model/types/settingsNavItem';
import { Typography } from '@/shared/ui/Typography';

interface SettingsNavProps {
  className?: string;
  active: SettingsSection;
  onSelect: (section: SettingsSection) => void;
}

export const SettingsNav: FC<SettingsNavProps> = ({ className, active, onSelect }) => {
  return (
    <nav className={classNames(styles.nav, className)} aria-label="Разделы настроек">
      <Typography variant="text-regular" className={styles.title}>
        Настройки
      </Typography>

      <ul className={styles.list}>
        {settingsNavItems.map(({ id, title, icon: Icon }) => (
          <li key={id}>
            <button
              type="button"
              className={classNames(styles.item, { [styles.active]: id === active })}
              aria-current={id === active ? 'page' : undefined}
              onClick={() => onSelect(id)}
            >
              <Icon className={styles.icon} />
              <span className={styles.label}>{title}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
