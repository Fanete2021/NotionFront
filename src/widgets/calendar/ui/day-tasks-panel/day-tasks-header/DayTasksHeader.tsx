import styles from './DayTasksHeader.module.css';
import { useCalendar } from '@widgets/calendar/model/calendar-context/useCalendar';
import { CalendarFilters } from '@features/calendar-filters';
import {
  clearDayPanelFilters,
  openCreateEventModal,
  setDayPanelFiltersOpen,
  toggleDayPanelFilter,
} from '@features/create-calendar-event';
import { useGetProjectsByWorkspaceQuery } from '@entities/project';
import { selectDayPanelFiltersOpen, selectDayPanelProjectIds } from '@/entities/calendar';
import { useAppDispatch, useAppSelector, useDismissibleLayer } from '@shared/lib';
import { Typography } from '@shared/ui/Typography';
import { Button } from '@shared/ui/Button';
import FilterIcon from '@shared/assets/icons/filter.svg';
import PlusIcon from '@shared/assets/icons/plus.svg';

export const DayTasksHeader = () => {
  const dispatch = useAppDispatch();
  const workspaceId = useAppSelector((s) => s.currentWorkspace.id);
  const { data: projects = [] } = useGetProjectsByWorkspaceQuery(workspaceId!, {
    skip: !workspaceId,
  });

  const selectedProjectIds = useAppSelector(selectDayPanelProjectIds);
  const isOpen = useAppSelector(selectDayPanelFiltersOpen);

  const popoverRef = useDismissibleLayer<HTMLDivElement>({
    enabled: isOpen,
    onDismiss: () => dispatch(setDayPanelFiltersOpen(false)),
  });

  const { selectedDate } = useCalendar();

  const date = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();
  const weekdayRaw = date.toLocaleDateString('ru-RU', { weekday: 'long' });
  const weekday = weekdayRaw[0].toUpperCase() + weekdayRaw.slice(1);
  const pretty = date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className={styles.header}>
      <div className={styles.headingRow}>
        <Typography className={styles.title} variant="h4">
          Задачи на день
        </Typography>
        <div className={styles.actions}>
          <div className={styles.filterWrapper} ref={popoverRef}>
            <Button
              variant="clear"
              onClick={() => dispatch(setDayPanelFiltersOpen(!isOpen))}
              aria-pressed={isOpen}
              aria-label="Фильтр по проектам"
            >
              <FilterIcon color="#6B7280" className={styles.icon} />
            </Button>

            {isOpen && (
              <div className={styles.filterPopover}>
                <div className={styles.filterHeader}>
                  <Typography variant="caption">Проекты</Typography>
                  {selectedProjectIds.length > 0 && (
                    <Button
                      className={styles.clearButton}
                      onClick={() => dispatch(clearDayPanelFilters())}
                    >
                      Сбросить
                    </Button>
                  )}
                </div>
                <CalendarFilters
                  projects={projects}
                  multi
                  selectedIds={selectedProjectIds}
                  onToggle={(id) => dispatch(toggleDayPanelFilter(id))}
                />
              </div>
            )}
          </div>
          <Button
            variant="clear"
            onClick={() =>
              dispatch(openCreateEventModal({ defaultDate: selectedDate ?? undefined }))
            }
          >
            <PlusIcon color="#6366F1" className={styles.icon} />
          </Button>
        </div>
      </div>
      <div className={styles.dateCard}>
        <Typography variant="caption" className={styles.weekday}>
          {weekday}
        </Typography>
        <Typography variant="caption" className={styles.date}>
          {pretty}
        </Typography>
      </div>
    </header>
  );
};
