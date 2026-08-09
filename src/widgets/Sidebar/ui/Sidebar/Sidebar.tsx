'use client';

import { FC } from 'react';
import classNames from 'classnames';
import { SidebarItem } from '../SidebarItem/SidebarItem';
import styles from './Sidebar.module.css';
import { sidebarItems } from './test.api';
import { UserProfile } from '../UserProfile/UserProfile';
import { Input } from '@/shared/ui/Input';
import SearchIcon from '@/shared/assets/icons/search.svg';
import { Typography } from '@/shared/ui/Typography';
import PencilIcon from '@/shared/assets/icons/pencil.svg';

interface SidebarProps {
  className?: string;
}

export const Sidebar: FC<SidebarProps> = ({ className }) => {
  const sidebarItemsList = sidebarItems;

  const handleSearch = () => {};

  return (
    <aside className={classNames(styles.sidebar, className)}>
      <div className={styles.top}>
        <div className={styles.workspace}>
          <div className={styles.workspaceLogo}>N</div>

          <Typography variant="text-medium">Рабочее пространство</Typography>
          <SearchIcon className={styles.icon} />
          <PencilIcon className={styles.icon} />
        </div>

        <Input
          className={styles.searchInput}
          placeholder="Поиск страниц..."
          addonLeft={<SearchIcon className={styles.icon} />}
          onChange={handleSearch}
        />

        <nav className={styles.navigation}>
          {sidebarItemsList.map((item) => (
            <SidebarItem key={item.id} item={item} />
          ))}
        </nav>
      </div>

      <UserProfile name="Alex Kim" email="alex@acme.io" />
    </aside>
  );
};
