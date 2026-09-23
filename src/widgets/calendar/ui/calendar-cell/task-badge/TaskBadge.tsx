import styles from './TaskBadge.module.css';
import type { BadgeTask } from '@entities/calendar';
import { Badge } from '@shared/ui/Badge';

interface TaskBadgeProps {
  task: BadgeTask;
}

export const TaskBadge = ({ task }: TaskBadgeProps) => {
  return (
    <Badge
      className={styles.taskBadge}
      text={task.name}
      bgColor={`var(--color-calendar-cell-badge-${task.color})`}
      border={`1px solid var(--color-calendar-cell-badge-border-${task.color})`}
    />
  );
};
