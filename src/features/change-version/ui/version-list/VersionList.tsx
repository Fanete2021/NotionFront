'use client';

import classNames from 'classnames';
import styles from './VersionList.module.css';
import { formatVersionDate } from '../../lib/formatVersionDate';
import type { VersionItem } from '../../model/version.types';
import { Button } from '@shared/ui/button';
import { Skeleton } from '@shared/ui/skeleton';
import { Typography } from '@shared/ui/typography';

const SKELETON_CARDS = [1, 2, 3, 4];

type VersionListProps = {
  versions: VersionItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
};

export const VersionList = ({
  versions,
  selectedId,
  onSelect,
  isLoading,
  isError,
  onRetry,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: VersionListProps) => {
  const isEmpty = versions.length === 0;

  return (
    <div className={styles.root}>
      <Typography variant="caption" className={styles.label}>
        Версии
      </Typography>
      <div className={styles.cards}>
        {isLoading &&
          SKELETON_CARDS.map((card) => (
            <Skeleton
              key={card}
              width="100%"
              height={60}
              borderRadius={6}
              className={styles.skeleton}
            />
          ))}

        {!isLoading && isEmpty && isError && (
          <div className={styles.state} role="alert">
            <Typography variant="caption">Не удалось загрузить историю изменений</Typography>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Повторить
            </Button>
          </div>
        )}

        {!isLoading && isEmpty && !isError && (
          <div className={styles.state}>
            <Typography variant="label" className={styles.stateTitle}>
              Версий пока нет
            </Typography>
            <Typography variant="caption">
              Они появятся автоматически по мере редактирования документа
            </Typography>
          </div>
        )}

        {versions.map((version) => (
          <button
            key={version.id}
            type="button"
            aria-pressed={version.id === selectedId}
            className={classNames(styles.card, {
              [styles.cardSelected]: version.id === selectedId,
            })}
            onClick={() => onSelect(version.id)}
          >
            <Typography variant="label" className={styles.cardTitle}>
              {formatVersionDate(version.createdAt)}
            </Typography>
            <Typography variant="caption">{version.authorName}</Typography>
          </button>
        ))}

        {!isEmpty && isError && (
          <Typography variant="caption" className={styles.moreError} role="alert">
            Не удалось загрузить версии
          </Typography>
        )}

        {!isEmpty && hasMore && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            fullWidth
            className={styles.more}
            disabled={isLoadingMore}
            onClick={onLoadMore}
          >
            {isLoadingMore ? 'Загрузка…' : 'Показать ещё'}
          </Button>
        )}
      </div>
    </div>
  );
};
