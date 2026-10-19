import classNames from 'classnames';
import styles from './VersionPreview.module.css';
import { formatVersionDate, formatVersionFullDate } from '../../lib/formatVersionDate';
import type { VersionItem } from '../../model/version.types';
import type { Page } from '@/shared/const/pageType';
import { Button } from '@shared/ui/button';
import { Typography } from '@shared/ui/typography';
import { getIconByName } from '@shared/ui/icon-picker';
import RefreshIcon from '@shared/assets/icons/refresh.svg';

type VersionPreviewProps = {
  page: Page;
  version: VersionItem | null;
  isRestoring: boolean;
  error: string | null;
  onRestore: () => void;
};

const renderPageIcon = (icon: string | null | undefined, className: string) => {
  const Icon = getIconByName(icon);
  return Icon ? <Icon className={className} aria-hidden /> : null;
};

export const VersionPreview = ({
  page,
  version,
  isRestoring,
  error,
  onRestore,
}: VersionPreviewProps) => {
  if (!version) {
    return (
      <div className={classNames(styles.root, styles.rootEmpty)}>
        <Typography variant="caption">Здесь появится информация о выбранной версии</Typography>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.previewHeader}>
        <div className={styles.heading}>
          <Typography variant="text-regular" className={styles.title}>
            Выбранная версия
          </Typography>
          <Typography variant="caption">
            {formatVersionDate(version.createdAt)} — {version.authorName}
          </Typography>
        </div>
        <Button
          type="button"
          variant="filled"
          size="sm"
          disabled={isRestoring}
          addonLeft={<RefreshIcon className={styles.restoreIcon} />}
          onClick={onRestore}
        >
          {isRestoring ? 'Восстановление…' : 'Восстановить эту версию'}
        </Button>
      </div>
      {error && (
        <Typography variant="caption" className={styles.error} role="alert">
          {error}
        </Typography>
      )}
      <div className={styles.documentCard}>
        {renderPageIcon(page.icon, styles.pageIcon)}
        <Typography variant="h4" className={styles.documentTitle}>
          {page.title}
        </Typography>
        <Typography variant="label" className={styles.documentText}>
          Документ вернётся к состоянию на {formatVersionFullDate(version.createdAt)}.
        </Typography>
        <Typography variant="label" className={styles.documentText}>
          Текущее содержимое сохранится в истории отдельной версией, поэтому восстановление можно
          отменить.
        </Typography>
      </div>
    </div>
  );
};
