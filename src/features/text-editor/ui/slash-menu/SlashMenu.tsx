import { SlashItem } from '../../model/slash-items';
import styles from './SlashMenu.module.css';
import { Button } from '@shared/ui/Button';

type SlashMenuProps = {
  items: SlashItem[];
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  command: ((item: SlashItem) => void) | null;
};

export const SlashMenu = ({
  items,
  command,
  selectedIndex,
  onSelectedIndexChange,
}: SlashMenuProps) => {
  return (
    <div className={styles.menu}>
      {items.map((item, index) => (
        <Button
          className={styles.menuButton}
          key={item.title}
          type="button"
          data-selected={index === selectedIndex}
          onMouseEnter={() => onSelectedIndexChange(index)}
          onClick={() => command?.(item)}
        >
          <span className={styles.title}>{item.title}</span>
          <span className={styles.subtitle}>{item.subtitle}</span>
        </Button>
      ))}
    </div>
  );
};
