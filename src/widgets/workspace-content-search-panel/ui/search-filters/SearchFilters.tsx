import styles from './SearchFilters.module.css';
import { workspaceChangeDateFilterItems } from '../../model/filterItems';
import { ProjectFilter } from '@features/search-workspace-content';
import { FilterGroup } from '@entities/workspace-search-filters';
import { Typography } from '@shared/ui/typography';
import type { SelectOption } from '@shared/ui/select';

interface SearchFiltersProps {
  dateId: string | null;
  onDateChange: (dateId: string | null) => void;
  projectId: string;
  onProjectChange: (projectId: string) => void;
  projects: SelectOption[];
  projectsLoading: boolean;
  projectsError: boolean;
}

export const SearchFilters = ({
  dateId,
  onDateChange,
  projectId,
  onProjectChange,
  projects,
  projectsLoading,
  projectsError,
}: SearchFiltersProps) => {
  return (
    <aside className={styles.filters} aria-label="Фильтры поиска">
      <Typography className={styles.filterTitle} variant="text-medium">
        Фильтры
      </Typography>

      <FilterGroup
        title="Дата изменения"
        items={workspaceChangeDateFilterItems}
        selectedId={dateId}
        onChange={(id) => onDateChange(id === dateId ? null : id)}
      />

      <ProjectFilter
        value={projectId}
        onChange={onProjectChange}
        options={projects}
        disabled={projectsLoading || projectsError}
      />
      {projectsError && (
        <Typography variant="caption" role="alert">
          Не удалось загрузить проекты
        </Typography>
      )}
    </aside>
  );
};
