'use client';

import { useMemo, useState } from 'react';
import styles from './TrashList.module.css';
import { trashListColumns } from '@/widgets/trash-list/ui/TrashListColumns';
import { trashItems } from '../model/mock.api';
import SearchIcon from '@/shared/assets/icons/search.svg';
import { Table } from '@/shared/ui/Table';
import { Input } from '@/shared/ui/Input/Input';
import { Typography } from '@/shared/ui/Typography/Typography';

export const TrashList = () => {
  const [search, setSearch] = useState('');

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const filteredItems = useMemo(() => {
    const value = search.toLowerCase();
    return trashItems.filter(
      (item) => item.title.toLowerCase().includes(value) || item.path.toLowerCase().includes(value),
    );
  }, [search]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.toolbar}>
        <Input
          className={styles.search}
          type="text"
          placeholder="Поиск по удалённым страницам..."
          value={search}
          onChange={(text) => handleSearch(text)}
          addonLeft={<SearchIcon className={styles.icon} />}
        />
        <Typography variant="text-regular">{filteredItems.length} удалённые страницы</Typography>
      </div>
      <Table
        columns={trashListColumns}
        data={filteredItems}
        rowKey={'id'}
        className={styles.table}
      />
    </section>
  );
};
