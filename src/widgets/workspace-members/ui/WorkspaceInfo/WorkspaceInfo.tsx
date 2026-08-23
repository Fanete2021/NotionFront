import styles from './WorkspaceInfo.module.css';
import { Typography } from '@/shared/ui/Typography';

interface WorkspaceInfoProps {
  workspaceName: string;
  memberCount: number;
}

export const WorkspaceInfo = ({ workspaceName, memberCount }: WorkspaceInfoProps) => {
  return (
    <div className={styles.info}>
      <Typography variant="h1" className={styles.title}>
        Рабочее пространство
      </Typography>
      <Typography variant="text-regular" className={styles.subtitle}>
        {workspaceName} · {memberCount} участников
      </Typography>
    </div>
  );
};
