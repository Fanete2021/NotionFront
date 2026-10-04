'use client';

import { useState } from 'react';
import styles from './TrashList.module.css';
import { trashListColumns } from '@/widgets/trash-list/ui/TrashListColumns';
import { useGetTrashedPagesQuery } from '@/entities/trash';
import SearchIcon from '@/shared/assets/icons/search.svg';
import { Table } from '@/shared/ui/Table';
import { Input } from '@/shared/ui/Input/Input';
import { Typography } from '@/shared/ui/Typography/Typography';
import { useAppSelector } from '@/shared/lib';

export const TrashList = () => {
  const workspaceId = useAppSelector((state) => state.currentWorkspace.id);
  const [search, setSearch] = useState('');

  const { data: trashItems = [], isLoading } = useGetTrashedPagesQuery(
    { workspaceId, q: search || undefined },
    { skip: !workspaceId },
  );

  return (
    <section className={styles.wrapper}>
      <div className={styles.toolbar}>
        <Input
          className={styles.search}
          type="text"
          placeholder="Поиск по удалённым страницам..."
          value={search}
          onChange={setSearch}
          addonLeft={<SearchIcon className={styles.icon} />}
        />
        <Typography variant="text-regular" className={styles.counter}>
          {trashItems.length} удалённые страницы
        </Typography>
      </div>
      <Table
        columns={trashListColumns}
        data={trashItems}
        rowKey="id"
        loading={isLoading}
        className={styles.table}
      />
    </section>
  );
};
