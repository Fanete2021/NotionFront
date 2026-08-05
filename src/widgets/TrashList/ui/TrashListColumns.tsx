import classNames from 'classnames';
import styles from './TrashList.module.css';
import { TrashItem } from '@/widgets/TrashList/model/mock.api';
import { TableColumn } from '@/shared/ui/Table/types';
import PageIcon from '@/shared/assets/icons/page.svg';
import RefreshIcon from '@/shared/assets/icons/refresh.svg';
import TrashIcon from '@/shared/assets/icons/trash-2.svg';
import { Typography } from '@/shared/ui/Typography/Typography';
import { Button } from '@/shared/ui/Button/Button';

export const trashListColumns: TableColumn<TrashItem>[] = [
  {
    key: 'title',
    title: 'Страница',
    render: (item) => (
      <div className={styles.page}>
        <div className={styles.iconWrapper}>
          <PageIcon className={styles.icon} />
        </div>

        <div className={styles.info}>
          <Typography className={styles.label} variant="text-medium">
            {item.title}
          </Typography>
          <Typography className={classNames(styles.description, styles.label)}>
            {item.path}
          </Typography>
        </div>
      </div>
    ),
  },

  {
    key: 'deletedBy',
    title: 'Удалил',
    width: 140,
  },

  {
    key: 'deletedAt',
    title: 'Дата удаления',
    width: 130,
  },

  {
    key: 'actions',
    title: 'Действия',
    width: 240,

    render: () => (
      <div className={styles.actions}>
        <Button
          className={styles.refresh}
          addonLeft={<RefreshIcon className={styles.actionIcon} />}
          variant="filled"
          color="success"
        >
          Восстановить
        </Button>

        <Button
          className={styles.delete}
          addonLeft={<TrashIcon className={styles.actionIcon} />}
          variant="filled"
          color="danger"
        >
          Удалить
        </Button>
      </div>
    ),
  },
];
