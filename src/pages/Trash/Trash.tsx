import classNames from 'classnames';
import styles from './Trash.module.css';
import { TrashList } from '@/widgets/TrashList/';
import { Button } from '@/shared/ui/Button/Button';
import { Typography } from '@/shared/ui/Typography/Typography';
import TrashIcon from '@/shared/assets/icons/trash-2.svg';

export function TrashPage() {
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
        </div>

        <Button
          className={styles.clearButton}
          variant="outline"
          color="danger"
          addonLeft={<TrashIcon className={styles.addon} />}
        >
          Очистить корзину
        </Button>
      </div>

      <TrashList />
    </main>
  );
}
