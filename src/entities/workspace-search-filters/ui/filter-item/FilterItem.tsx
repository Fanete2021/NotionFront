import classNames from 'classnames';
import styles from './FilterItem.module.css';
import { FilterOption } from '../../model/types/filterItem';
import { Button } from '@shared/ui/Button';

interface FilterItemProps {
  option: FilterOption;
  active?: boolean;
  onSelect: (itemId: string) => void;
}

export const FilterItem = ({ option, active = false, onSelect }: FilterItemProps) => {
  const { title, icon: Icon, id } = option;

  return (
    <li>
      <Button
        align="start"
        variant="clear"
        className={classNames(styles.item, {
          [styles.active]: active,
        })}
        aria-pressed={active}
        onClick={() => onSelect(id)}
      >
        {Icon && <Icon className={styles.icon} aria-hidden="true" />}
        <span className={styles.title}>{title}</span>
      </Button>
    </li>
  );
};
