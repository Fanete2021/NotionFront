'use client';
import { useState } from 'react';
import { SearchFilters } from '../search-filters/SearchFilters';
import styles from './WorkspaceSearch.module.css';
import { SearchInput } from '@features/search-workspace-content';
import { SearchList } from '@entities/workspace-search-list';

export const WorkspaceSearch = () => {
  const [dateId, setDateId] = useState<string | null>(null);

  return (
    <div className={styles.workspaceSearch}>
      <SearchInput />
      <div className={styles.body}>
        <SearchFilters dateId={dateId} onDateChange={setDateId} />
        <SearchList />
      </div>
    </div>
  );
};
