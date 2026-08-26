import { SlashItem } from '../../model/slash-items';
import styles from './SlashMenu.module.css';
import { Button } from '@shared/ui/Button';
import { Typography } from '@shared/ui/Typography';

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
    <div className={styles.menu} role="listbox">
      {items.map((item, index) => {
        const Icon = item.icon;
        const isSelected = index === selectedIndex;

        return (
          <Button
            variant="clear"
            key={item.title}
            className={styles.editorButton}
            type="button"
            data-selected={isSelected}
            aria-selected={isSelected}
            role="option"
            onMouseEnter={() => onSelectedIndexChange(index)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => command?.(item)}
          >
            <div className={styles.icon}>
              <Icon className={styles.img} aria-hidden />
            </div>

            <div className={styles.text}>
              <Typography variant="text-label" className={styles.title}>
                {item.title}
              </Typography>

              <Typography variant="text-micro" className={styles.subtitle}>
                {item.subtitle}
              </Typography>
            </div>
          </Button>
        );
      })}
    </div>
  );
};
