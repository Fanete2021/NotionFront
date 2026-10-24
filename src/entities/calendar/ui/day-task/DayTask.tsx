import type { KeyboardEvent, MouseEvent } from 'react';
import styles from './DayTask.module.css';
import type { DayTask as DayTaskData } from '../../model/types/day-task';
import { Card } from '@shared/ui/card';
import { Checkbox } from '@shared/ui/checkbox';
import { Typography } from '@shared/ui/typography';
import { Badge } from '@shared/ui/badge';

interface DayTaskProps {
  dayTask: DayTaskData;
  onClick?: (dayTask: DayTaskData) => void;
  onCompletedChange?: (dayTask: DayTaskData, isCompleted: boolean) => void;
}

// Клик по чекбоксу не должен открывать редактирование задачи
const stopPropagation = (e: MouseEvent) => e.stopPropagation();

export const DayTask = ({ dayTask, onClick, onCompletedChange }: DayTaskProps) => {
  const handleKeyDownEvent = (e: KeyboardEvent<HTMLElement>) => {
    // Пробел на чекбоксе переключает его, а не открывает карточку
    if (e.target !== e.currentTarget) return;

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
        <div className={styles.taskTitle} data-task-completed={dayTask.isCompleted}>
          <span className={styles.checkboxWrapper} onClick={stopPropagation}>
            <Checkbox
              checked={dayTask.isCompleted}
              aria-label={dayTask.label}
              onCheckedChange={(checked) => onCompletedChange?.(dayTask, checked)}
            />
          </span>
          {dayTask.label}
        </div>
        {dayTask.viewed && <div className={styles.circle} />}
      </div>

      <div className={styles.taskInfo}>
        <Typography variant="text-micro">{dayTask.time}</Typography>
        <Badge className={styles.projectBadge} status="new" text={dayTask.projectName} />
      </div>
    </Card>
  );
};
