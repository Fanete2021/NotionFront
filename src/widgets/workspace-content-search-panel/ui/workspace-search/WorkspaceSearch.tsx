'use client';
import { useState } from 'react';
import { SearchFilters } from '../search-filters/SearchFilters';
import styles from './WorkspaceSearch.module.css';
import { filterPagesByDate, getSearchDateRange } from '../../model/searchFilters';
import { SearchInput } from '@features/search-workspace-content';
import { SearchList, type SearchItem } from '@entities/workspace-search-list';
import { useGetPagesByWorkspaceQuery, useSearchPagesQuery } from '@entities/page';
import { useGetProjectsByWorkspaceQuery } from '@entities/project';
import { formatRelativeTime, useAppSelector, useDebounce, useRelativeTimeTick } from '@shared/lib';

const SEARCH_LIMIT = 50;

export const WorkspaceSearch = () => {
  const workspaceId = useAppSelector((state) => state.currentWorkspace.id);

  return <WorkspaceSearchContent key={workspaceId} workspaceId={workspaceId} />;
};

const WorkspaceSearchContent = ({ workspaceId }: { workspaceId: string | null }) => {
  const tick = useRelativeTimeTick(15_000);
  const [dateId, setDateId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceSearch = useDebounce(setDebouncedSearch, 300);
  const query = search.trim();
  const isSearching = query.length > 0;
  const isDebouncing = isSearching && query !== debouncedSearch;
  const dateRange = getSearchDateRange(dateId);
  const projectsQuery = useGetProjectsByWorkspaceQuery(workspaceId || '', {
    skip: !workspaceId,
  });
  const pagesQuery = useGetPagesByWorkspaceQuery(
    { workspaceId: workspaceId || '', projectId: projectId || undefined },
    { skip: !workspaceId || isSearching },
  );
  const searchQuery = useSearchPagesQuery(
    {
      workspaceId: workspaceId || '',
      q: debouncedSearch,
      projectId: projectId || undefined,
      ...dateRange,
      limit: SEARCH_LIMIT,
    },
    { skip: !workspaceId || !isSearching || isDebouncing },
  );
  const activeQuery = isSearching ? searchQuery : pagesQuery;
  const projects = projectsQuery.currentData ?? [];
  const pages = filterPagesByDate(pagesQuery.currentData ?? [], dateRange);
  const items: SearchItem[] = isSearching
    ? (searchQuery.currentData ?? []).map((page) => ({
        id: page.pageId,
        icon: page.icon,
        title: page.title,
        path: page.path.map(({ name }) => name).join(' / ') || 'Документы',
        description: page.snippet,
        lastTimeEdited: formatRelativeTime(page.updatedAt, tick),
      }))
    : pages.map((page) => ({
        id: page.id,
        icon: page.icon,
        title: page.title,
        path: projects.find((project) => project.id === page.projectId)?.name || 'Документы',
        description: page.seoDescription,
        lastTimeEdited: formatRelativeTime(page.updatedAt, tick),
      }));

  const message = !workspaceId ? 'Выберите рабочее пространство для поиска страниц' : undefined;

  return (
    <div className={styles.workspaceSearch}>
      <SearchInput
        value={search}
        onChange={(value) => {
          setSearch(value);
          debounceSearch(value.trim());
        }}
      />
      <div className={styles.body}>
        <SearchFilters
          dateId={dateId}
          onDateChange={setDateId}
          projectId={projectId}
          onProjectChange={setProjectId}
          projects={projects.map(({ id, name }) => ({ value: id, label: name }))}
          projectsLoading={projectsQuery.isLoading || !workspaceId}
          projectsError={projectsQuery.isError}
        />
        <SearchList
          items={items}
          isLoading={isDebouncing || activeQuery.isFetching}
          isError={activeQuery.isError}
          onRetry={() => void activeQuery.refetch()}
          message={message}
          query={query}
          limitReached={isSearching && items.length === SEARCH_LIMIT}
        />
      </div>
    </div>
  );
};
