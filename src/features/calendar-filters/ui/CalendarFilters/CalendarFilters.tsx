import styles from './CalendarFilters.module.css';
import { filterItems } from '@features/calendar-filters/model/filterItems';
import { FilterChip } from '@shared/ui/FilterChip';

export const CalendarFilters = () => {
  return (
    <ul className={styles.filtersList}>
      {filterItems.map((item) => (
        <li key={item.label}>
          <FilterChip label={item.label} color={item.color} />
        </li>
      ))}
    </ul>
  );
};
