'use client';

import { useState } from 'react';
import classNames from 'classnames';
import styles from './Trash.module.css';
import { TrashList } from '@/widgets/trash-list';
import { useEmptyTrashMutation } from '@/entities/trash';
import { Button } from '@/shared/ui/Button/Button';
import { Typography } from '@/shared/ui/Typography/Typography';
import TrashIcon from '@/shared/assets/icons/trash-2.svg';
import { useAppSelector } from '@/shared/lib';

export function TrashPage() {
  const workspaceId = useAppSelector((state) => state.currentWorkspace.id);
  const [emptyTrash, { isLoading }] = useEmptyTrashMutation();
  const [error, setError] = useState<string | null>(null);

  const handleClearTrash = async () => {
    if (!workspaceId) return;
    if (!confirm('Очистить корзину? Все удалённые страницы будут удалены навсегда.')) return;

    setError(null);
    try {
      await emptyTrash(workspaceId).unwrap();
    } catch (err) {
      console.error('Ошибка очистки корзины:', err);
      setError('Не удалось очистить корзину');
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.text}>
          <Typography className={styles.label} variant="text-regular">
            Корзина
          </Typography>
          <Typography
            className={classNames(styles.description, styles.label)}
            variant="text-regular"
          >
            Удалённые страницы хранятся 30 дней до окончательного удаления.
          </Typography>
          {error && (
            <Typography className={styles.error} variant="caption">
              {error}
            </Typography>
          )}
        </div>

        <Button
          className={styles.clearButton}
          variant="outline"
          color="danger"
          addonLeft={<TrashIcon className={styles.addon} />}
          onClick={handleClearTrash}
          disabled={isLoading || !workspaceId}
        >
          {isLoading ? 'Очистка…' : 'Очистить корзину'}
        </Button>
      </div>

      <TrashList />
    </main>
  );
}
