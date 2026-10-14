import styles from './CalendarFilters.module.css';
import type { Project } from '@entities/project';
import { FilterChip } from '@shared/ui/filter-chip';

const PALETTE = ['primary', 'success', 'warning', 'danger', 'info', 'neutral'] as const;

interface CalendarFiltersBaseProps {
  projects: Project[];
}

interface SingleSelectProps extends CalendarFiltersBaseProps {
  multi?: false;
  activeProjectId: string | null;
  onChange: (id: string | null) => void;
}

interface MultiSelectProps extends CalendarFiltersBaseProps {
  multi: true;
  selectedIds: string[];
  onToggle: (id: string) => void;
}

type CalendarFiltersProps = SingleSelectProps | MultiSelectProps;

export const CalendarFilters = (props: CalendarFiltersProps) => {
  const { projects } = props;

  if (!projects.length) return null;

  if (props.multi) {
    return (
      <ul className={styles.filtersList}>
        {projects.map((p, i) => (
          <li key={p.id}>
            <FilterChip
              label={p.name}
              color={PALETTE[i % PALETTE.length]}
              active={props.selectedIds.includes(p.id)}
              onClick={() => props.onToggle(p.id)}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={styles.filtersList}>
      <li>
        <FilterChip
          label="Все"
          color="neutral"
          active={props.activeProjectId === null}
          onClick={() => props.onChange(null)}
        />
      </li>
      {projects.map((p, i) => (
        <li key={p.id}>
          <FilterChip
            label={p.name}
            color={PALETTE[i % PALETTE.length]}
            active={props.activeProjectId === p.id}
            onClick={() => props.onChange(p.id)}
          />
        </li>
      ))}
    </ul>
  );
};
