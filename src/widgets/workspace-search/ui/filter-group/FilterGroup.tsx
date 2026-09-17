import styles from './FilterGroup.module.css';
import { FilterItem } from '../filter-item/FilterItem';
import { FilterOption } from '@features/search-workspace-content';
import { Typography } from '@shared/ui/Typography';

interface FilterGroupProps {
  title: string;
  items: readonly FilterOption[];
  selectedId: string | null;
  onChange: (id: string) => void;
}

export const FilterGroup = ({ title, items, selectedId, onChange }: FilterGroupProps) => {
  return (
    <div className={styles.group}>
      <Typography className={styles.title} variant="text-medium">
        {title}
      </Typography>
      <ul className={styles.list}>
        {items.map((item) => (
          <FilterItem
            onSelect={onChange}
            key={item.id}
            option={item}
            active={item.id === selectedId}
          />
        ))}
      </ul>
    </div>
  );
};
