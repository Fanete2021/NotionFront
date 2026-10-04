import styles from './SearchFilters.module.css';
import { workspaceChangeDateFilterItems } from '../../model/filterItems';
import { ProjectFilter } from '@features/search-workspace-content';
import { FilterGroup } from '@entities/workspace-search-filters';
import { Typography } from '@shared/ui/typography';

interface SearchFiltersProps {
  dateId: string | null;
  onDateChange: (dateId: string | null) => void;
}

export const SearchFilters = ({ dateId, onDateChange }: SearchFiltersProps) => {
  return (
    <aside className={styles.filters} aria-label="Фильтры поиска">
      <Typography className={styles.filterTitle} variant="text-medium">
        Фильтры
      </Typography>

      <FilterGroup
        title="Дата изменения"
        items={workspaceChangeDateFilterItems}
        selectedId={dateId}
        onChange={onDateChange}
      />

      <ProjectFilter />
    </aside>
  );
};
