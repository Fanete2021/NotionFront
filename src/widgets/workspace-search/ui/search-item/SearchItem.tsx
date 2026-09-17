import styles from './SearchItem.module.css';
import type { SearchItem as SearchItemData } from '@features/search-workspace-content';
import { Card } from '@shared/ui/Card';
import { Button } from '@shared/ui/Button';
import { Typography } from '@shared/ui/Typography';

interface SearchItemProps {
  searchItem: SearchItemData;
  selected: boolean;
  onSelect: () => void;
}

export const SearchItem = ({ searchItem, selected, onSelect }: SearchItemProps) => {
  const { icon: Icon, title, description, lastTimeEdited, path } = searchItem;

  return (
    <Card className={styles.searchCard} selected={selected} variant="outlined">
      <Button
        className={styles.selectButton}
        variant="clear"
        align="start"
        fullWidth
        aria-pressed={selected}
        onClick={onSelect}
      >
        <span className={styles.iconWrapper}>
          <Icon className={styles.icon} aria-hidden="true" />
        </span>

        <span className={styles.text}>
          <span className={styles.title}>{title}</span>
          <Typography variant="caption">{path}</Typography>
          <span className={styles.description}>{description}</span>
        </span>

        <Typography className={styles.editedTime} variant="caption">
          {lastTimeEdited}
        </Typography>
      </Button>
    </Card>
  );
};
