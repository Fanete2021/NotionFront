import styles from './WorkspaceMembersHeader.module.css';
import { Typography } from '@/shared/ui/Typography';

export const WorkspaceMembersHeader = () => {
  return (
    <div className={styles.header}>
      <Typography variant="text-medium" className={styles.title}>
        Главная
      </Typography>
    </div>
  );
};
