import classNames from 'classnames';
import styles from './CalendarFormatSwitcher.module.css';
import { calendarSwitcherItems } from '../../model/mock-data/switchItems';
import type { DisplayFormat } from '../../model/types/calendar-display-format';
import { Button } from '@shared/ui/Button';

interface CalendarFormatSwitcherProps {
  selectedFormat: DisplayFormat;
  onSelect: (format: DisplayFormat) => void;
}

export const CalendarFormatSwitcher = ({
  selectedFormat,
  onSelect,
}: CalendarFormatSwitcherProps) => {
  return (
    <div className={styles.switcher}>
      <ul className={styles.formatList}>
        {calendarSwitcherItems.map((item) => (
          <li key={item.id}>
            <Button
              variant="clear"
              onClick={() => onSelect(item.id)}
              aria-pressed={item.id === selectedFormat}
              className={classNames(styles.formatItem, {
                [styles.active]: item.id === selectedFormat,
              })}
            >
              {item.format}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
