import styles from './MainSkeleton.module.css';
import { Skeleton } from '@/shared/ui/skeleton';

export function MainSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Skeleton width={200} height={32} borderRadius={6} />
      </div>

      <div className={styles.infoBlock}>
        <Skeleton width={150} height={24} borderRadius={4} />
      </div>

      <div className={styles.linksBlock}>
        <Skeleton width={180} height={20} borderRadius={4} />
        <div className={styles.linksList}>
          <Skeleton width="100%" height={56} borderRadius={8} />
          <Skeleton width="100%" height={56} borderRadius={8} />
        </div>
      </div>

      <div className={styles.membersBlock}>
        <Skeleton width={140} height={20} borderRadius={4} />
        <div className={styles.membersList}>
          <Skeleton width="100%" height={48} borderRadius={6} />
          <Skeleton width="100%" height={48} borderRadius={6} />
          <Skeleton width="100%" height={48} borderRadius={6} />
        </div>
      </div>
    </div>
  );
}
