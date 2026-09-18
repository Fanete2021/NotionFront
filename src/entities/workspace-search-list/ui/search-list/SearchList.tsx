'use client';

import { useState } from 'react';
import styles from './SearchList.module.css';
import { searchItems } from '@entities/workspace-search-list/model/searchItems';
import { SearchItem } from '../search-item/SearchItem';
import { Typography } from '@shared/ui/Typography';

export const SearchList = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className={styles.searchBody}>
      <Typography variant="text-regular" className={styles.totalResult}>
        12 результатов по запросу «компоненты дизайн-системы»
      </Typography>
      <ul className={styles.list}>
        {searchItems.map((item) => (
          <li key={item.id}>
            <SearchItem
              searchItem={item}
              selected={item.id === selectedId}
              onSelect={() => setSelectedId(item.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
