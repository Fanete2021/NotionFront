import classNames from 'classnames';
import styles from './CalendarFormatSwitcher.module.css';
import { calendarSwitcherItems } from '../../model/switchItems';
import { DisplayFormat } from '@features/calendar';
import { Button } from '@shared/ui/Button';
import { Typography } from '@shared/ui/Typography';

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
          <Button key={item.id} variant="clear" onClick={() => onSelect(item.id)}>
            <li
              className={classNames(styles.formatItem, {
                [styles.active]: item.id === selectedFormat,
              })}
            >
              <Typography className={styles.format} variant="text-medium">
                {item.format}
              </Typography>
            </li>
          </Button>
        ))}
      </ul>
    </div>
  );
};
