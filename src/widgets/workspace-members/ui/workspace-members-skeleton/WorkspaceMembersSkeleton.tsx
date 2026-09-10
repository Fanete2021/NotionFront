import styles from './WorkspaceMembersSkeleton.module.css';
import { Skeleton } from '@/shared/ui/skeleton';

export const WorkspaceMembersSkeleton = () => {
  return (
    <div className={styles.membersBlock}>
      <Skeleton width={140} height={20} borderRadius={4} />
      <div className={styles.membersList}>
        <Skeleton width="100%" height={48} borderRadius={6} />
        <Skeleton width="100%" height={48} borderRadius={6} />
        <Skeleton width="100%" height={48} borderRadius={6} />
        <Skeleton width="100%" height={48} borderRadius={6} />
      </div>
    </div>
  );
};
