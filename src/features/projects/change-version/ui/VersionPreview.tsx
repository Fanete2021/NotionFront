import styles from './VersionPreview.module.css';
import { Button } from '@shared/ui/Button';
import { Typography } from '@shared/ui/Typography';
import RefreshIcon from '@shared/assets/icons/refresh.svg';

export const VersionPreview = () => {
  return (
    <div className={styles.root}>
      <div className={styles.previewHeader}>
        <div className={styles.heading}>
          <Typography variant="text-regular" className={styles.title}>
            Предпросмотр
          </Typography>
          <Typography variant="caption">Сегодня, 11:52 — Женя Ли</Typography>
        </div>
        <Button
          type="button"
          variant="filled"
          size="sm"
          addonLeft={<RefreshIcon className={styles.restoreIcon} />}
        >
          Восстановить эту версию
        </Button>
      </div>
      <div className={styles.documentCard}>
        <span className={styles.pageIcon} aria-hidden>
          📐
        </span>
        <Typography variant="h4" className={styles.documentTitle}>
          Дизайн-система — Компоненты
        </Typography>
        <Typography variant="text-alt" className={styles.documentSection}>
          Обзор
        </Typography>
        <Typography variant="label" className={styles.documentText}>
          Этот документ охватывает все основные UI-компоненты. Каждый компонент включает
          интерактивные состояния, размерные варианты…
        </Typography>
      </div>
    </div>
  );
};
