import styles from './DocumentBodySkeleton.module.css';
import { Skeleton } from '@/shared/ui/skeleton';

export const DocumentBodySkeleton = () => (
  <div className={styles.container}>
    <Skeleton height={32} width="60%" borderRadius={4} />
    <Skeleton height={16} width="100%" borderRadius={4} />
    <Skeleton height={16} width="90%" borderRadius={4} />
    <Skeleton height={16} width="80%" borderRadius={4} />
  </div>
);
