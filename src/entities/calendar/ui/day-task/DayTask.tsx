import type { KeyboardEvent } from 'react';
import styles from './DayTask.module.css';
import type { DayTask as DayTaskData } from '../../model/types/day-task';
import { Card } from '@shared/ui/Card';
import { Checkbox } from '@shared/ui/Checkbox';
import { Typography } from '@shared/ui/Typography';
import { Badge } from '@shared/ui/Badge';

interface DayTaskProps {
  dayTask: DayTaskData;
  onClick?: (dayTask: DayTaskData) => void;
}

export const DayTask = ({ dayTask, onClick }: DayTaskProps) => {
  const handleKeyDownEvent = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(dayTask);
    }
  };

  return (
    <Card
      className={styles.taskCard}
      onClick={() => onClick?.(dayTask)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDownEvent}
    >
      <div className={styles.taskLabel} data-task-viewed={dayTask.viewed}>
        <Checkbox checked={dayTask.isCompleted}>{dayTask.label}</Checkbox>
        {dayTask.viewed && <div className={styles.circle} />}
      </div>

      <div className={styles.taskInfo}>
        <Typography variant="text-micro">{dayTask.time}</Typography>
        <Badge className={styles.projectBadge} status="new" text={dayTask.projectName} />
      </div>
    </Card>
  );
};
