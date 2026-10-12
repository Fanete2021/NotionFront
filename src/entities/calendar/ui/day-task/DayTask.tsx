import styles from './DayTask.module.css';
import type { DayTask as DayTaskData } from '../../model/types/day-task';
import { Card } from '@shared/ui/card';
import { Checkbox } from '@shared/ui/checkbox';
import { Typography } from '@shared/ui/typography';
import { Badge } from '@shared/ui/badge';

interface DayTaskProps {
  dayTask: DayTaskData;
}

export const DayTask = ({ dayTask }: DayTaskProps) => {
  return (
    <Card className={styles.taskCard}>
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
