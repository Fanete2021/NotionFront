'use client';

import classNames from 'classnames';
import { useMemo, useState } from 'react';
import styles from './TrashList.module.css';
import { TrashItem, trashItems } from '../mock.api';
import SearchIcon from '@/shared/assets/icons/search.svg';
import { Table } from '@/shared/ui/Table';
import { TableColumn } from '@/shared/ui/Table/types';
import PageIcon from '@/shared/assets/icons/page.svg';
import RefreshIcon from '@/shared/assets/icons/refresh.svg';
import TrashIcon from '@/shared/assets/icons/trash-2.svg';
import { Input } from '@/shared/ui/Input/Input';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Button } from '@/shared/ui/Button';

const columns: TableColumn<TrashItem>[] = [
  {
    key: 'title',
    title: 'Страница',
    render: (item) => (
      <div className={styles.page}>
        <div className={styles.iconWrapper}>
          <PageIcon className={styles.icon} />
        </div>

        <div className={styles.info}>
          <Typography className={styles.label} variant="text-medium">
            {item.title}
          </Typography>
          <Typography className={classNames(styles.description, styles.label)}>
            {item.path}
          </Typography>
        </div>
      </div>
    ),
  },

  {
    key: 'deletedBy',
    title: 'Удалил',
    width: 140,
  },

  {
    key: 'deletedAt',
    title: 'Дата удаления',
    width: 130,
  },

  {
    key: 'actions',
    title: 'Действия',
    width: 240,

    render: () => (
      <div className={styles.actions}>
        <Button
          className={styles.refresh}
          addonLeft={<RefreshIcon className={styles.actionIcon} />}
          variant="filled"
          color="success"
        >
          Восстановить
        </Button>

        <Button
          className={styles.delete}
          addonLeft={<TrashIcon className={styles.actionIcon} />}
          variant="filled"
          color="danger"
        >
          Удалить
        </Button>
      </div>
    ),
  },
];

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
      <Table columns={columns} data={filteredItems} rowKey={'id'} className={styles.table} />
    </section>
  );
};
