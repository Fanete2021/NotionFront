'use client';

import { useState } from 'react';
import styles from './PublicFeedPage.module.css';
import { PublicFeed } from '@widgets/public-feed';
import { PublicHeader } from '@widgets/public-header';
import { mockPublishedDocuments } from '@entities/published-document';
import { Input } from '@shared/ui/input';
import SearchIcon from '@shared/assets/icons/search.svg';

export const PublicFeedPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
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
        documents={mockPublishedDocuments}
        search={search}
        page={page}
        onPageChange={handlePageChange}
        onResetSearch={() => handleSearch('')}
      />
    </>
  );
};
