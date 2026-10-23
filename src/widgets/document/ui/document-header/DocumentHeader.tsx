'use client';

import styles from './DocumentHeader.module.css';
import { RelativeTime } from '../relative-time/RelativeTime';
import type { Page } from '@/shared/const/pageType';
import { Typography } from '@shared/ui/typography';
import { getIconByName } from '@shared/ui/icon-picker';

interface DocumentHeaderProps {
  page: Page;
  updatedAt?: string;
  authorName?: string;
  saveError?: string | null;
  isSaving?: boolean;
}

const renderPageIcon = (icon: string | null | undefined, className: string) => {
  const Icon = getIconByName(icon);
  return Icon ? <Icon className={className} /> : null;
};

export const DocumentHeader = ({
  page,
  updatedAt,
  authorName,
  saveError,
  isSaving,
}: DocumentHeaderProps) => {
  const editedAt = updatedAt ?? page.updatedAt;

  return (
    <div className={styles.heading}>
      {renderPageIcon(page.icon, styles.pageIcon)}
      <div className={styles.headingText}>
        <Typography variant="h1" className={styles.title}>
          {page.title}
        </Typography>
        <Typography variant="caption" className={saveError ? styles.metaError : styles.meta}>
          {saveError ? (
            saveError
          ) : isSaving ? (
            'Сохранение…'
          ) : editedAt ? (
            <>
              Последнее изменение: {authorName ?? 'Неизвестный'} · <RelativeTime date={editedAt} />
            </>
          ) : authorName ? (
            `Автор ${authorName}`
          ) : null}
        </Typography>
      </div>
    </div>
  );
};
