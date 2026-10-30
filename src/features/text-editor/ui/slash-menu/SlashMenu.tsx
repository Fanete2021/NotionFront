import { aiSlashItem, type SlashItem } from '../../model/slash-items';
import styles from './SlashMenu.module.css';
import { Button } from '@shared/ui/button';
import { Typography } from '@shared/ui/typography';

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
  if (items.length === 0) {
    return null;
  }
  return (
    <div className={styles.menu} role="listbox" aria-label="Команды редактора">
      {items.map((item, index) => {
        const Icon = item.icon;
        const isSelected = index === selectedIndex;
        const isAi = item === aiSlashItem;

        return (
          <Button
            variant="clear"
            key={item.title}
            className={styles.editorButton}
            type="button"
            data-selected={isSelected}
            data-ai={isAi || undefined}
            aria-selected={isSelected}
            role="option"
            onMouseEnter={() => onSelectedIndexChange(index)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => command?.(item)}
          >
            <div className={styles.icon}>
              <Icon className={isAi ? undefined : styles.img} aria-hidden />
            </div>

            <div className={styles.text}>
              <Typography variant="text-label" className={styles.title}>
                {item.title}
              </Typography>

              <Typography variant="text-micro" className={styles.subtitle}>
                {item.subtitle}
              </Typography>
            </div>
            {isAi && <span className={styles.shortcut}>/ai</span>}
          </Button>
        );
      })}
    </div>
  );
};
