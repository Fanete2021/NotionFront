import styles from './TrashList.module.css';
import { TrashedPage, useRestorePageMutation } from '@/entities/page';
import { useHardDeletePageMutation } from '@/entities/page';
import { formatRelativeTime } from '@shared/lib';
import { TableColumn } from '@/shared/ui/Table/types';
import PageIcon from '@/shared/assets/icons/page.svg';
import RefreshIcon from '@/shared/assets/icons/refresh.svg';
import TrashIcon from '@/shared/assets/icons/trash-2.svg';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Button } from '@/shared/ui/Button/Button';

const RestoreButton = ({ pageId }: { pageId: string }) => {
  const [restorePage, { isLoading }] = useRestorePageMutation();

  return (
    <Button
      className={styles.refresh}
      addonLeft={<RefreshIcon className={styles.actionIcon} />}
      variant="filled"
      color="success"
      disabled={isLoading}
      onClick={() => restorePage(pageId)}
    >
      {isLoading ? 'Восстановление…' : 'Восстановить'}
    </Button>
  );
};

const HardDeleteButton = ({ pageId, workspaceId }: { pageId: string; workspaceId: string }) => {
  const [hardDelete, { isLoading }] = useHardDeletePageMutation();

  return (
    <Button
      className={styles.delete}
      addonLeft={<TrashIcon className={styles.actionIcon} />}
      variant="filled"
      color="danger"
      disabled={isLoading}
      onClick={() => hardDelete({ id: pageId, workspaceId })}
    >
      {isLoading ? 'Удаление…' : 'Удалить'}
    </Button>
  );
};

export const trashListColumns: TableColumn<TrashedPage>[] = [
  {
    key: 'title',
    title: 'Страница',
    className: styles.pageColumn,
    render: (item) => (
      <div className={styles.page}>
        <div className={styles.iconWrapper}>
          <PageIcon className={styles.icon} />
        </div>
        <div className={styles.info}>
          <Typography className={styles.label} variant="text-medium">
            {item.title}
          </Typography>
        </div>
      </div>
    ),
  },
  {
    key: 'deletedBy',
    title: 'Удалил',
    width: 140,
    className: styles.deletedByColumn,
    render: (item) => item.deletedBy?.name ?? 'Аккаунт удалён',
  },
  {
    key: 'deletedAt',
    title: 'Дата удаления',
    width: 130,
    render: (item) => formatRelativeTime(item.deletedAt),
  },
  {
    key: 'actions',
    title: 'Действия',
    width: 240,
    className: styles.actionsColumn,
    render: (item) => (
      <div className={styles.actions}>
        <RestoreButton pageId={item.id} />
        <HardDeleteButton pageId={item.id} workspaceId={item.workspaceId} />
      </div>
    ),
  },
];
