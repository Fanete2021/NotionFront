'use client';

import { useState } from 'react';
import styles from './PublicFeedPage.module.css';
import { PublicFeed } from '@widgets/public-feed';
import { PublicHeader } from '@widgets/public-header';
import { Input } from '@shared/ui/input';
import SearchIcon from '@shared/assets/icons/search.svg';

export const PublicFeedPage = () => {
  const [search, setSearch] = useState('');
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([undefined]);
  const page = cursorHistory.length;
  const cursor = cursorHistory[page - 1];

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleNextPage = (nextCursor: string) => {
    setCursorHistory((history) => [...history, nextCursor]);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handlePreviousPage = () => {
    setCursorHistory((history) => (history.length > 1 ? history.slice(0, -1) : history));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <>
      <PublicHeader
        search={
          <Input
            type="search"
            aria-label="Поиск по ленте"
            placeholder="Поиск по ленте..."
            value={search}
            onChange={handleSearch}
            addonLeft={<SearchIcon aria-hidden="true" />}
            className={styles.search}
          />
        }
      />
      <PublicFeed
        search={search}
        page={page}
        cursor={cursor}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        onResetSearch={() => handleSearch('')}
      />
    </>
  );
};
