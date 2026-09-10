import styles from './NotFoundWorkspace.module.css';
import { Typography } from '@/shared/ui/Typography';
import OpenFolder from '@/shared/assets/icons/open-folder.svg';

export function NotFoundWorkspace() {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <OpenFolder className={styles.icon} />
      </div>
      <div className={styles.textContainer}>
        <Typography variant="h4" className={styles.title}>
          Workspace не выбран
        </Typography>
        <Typography variant="text-regular" className={styles.subtitle}>
          Выберите рабочее пространство в списке, чтобы продолжить работу
        </Typography>
      </div>
    </div>
  );
}
