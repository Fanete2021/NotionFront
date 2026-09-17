import styles from './SearchFilters.module.css';
import { FilterGroup } from '../filter-group/FilterGroup';
import { workspaceChangeDateFilterItems, workspaceTypeFilterItems } from '../../model/filterItems';
import { ProjectFilter } from '@features/search-workspace-content';
import { Typography } from '@shared/ui/Typography';

interface SearchFiltersProps {
  typeId: string;
  dateId: string | null;
  onTypeChange: (typeId: string) => void;
  onDateChange: (dateId: string | null) => void;
}

export const SearchFilters = ({
  typeId,
  dateId,
  onDateChange,
  onTypeChange,
}: SearchFiltersProps) => {
  return (
    <aside className={styles.filters} aria-label="Фильтры поиска">
      <Typography className={styles.filterTitle} variant="text-medium">
        Фильтры
      </Typography>

      <FilterGroup
        title="Тип"
        items={workspaceTypeFilterItems}
        selectedId={typeId}
        onChange={onTypeChange}
      />

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
