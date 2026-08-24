'use client';

import styles from './SidebarSkeleton.module.css';
import { Skeleton } from '@/shared/ui/Skeleton';

export const SidebarSkeleton = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.workspaceSwitcher}>
        <Skeleton width={30} height={30} borderRadius={6} />
        <Skeleton width={120} height={18} borderRadius={4} />
      </div>
      <Skeleton width="auto" height={32} className={styles.searchSkeleton} borderRadius={6} />
      <div className={styles.navigation}>
        <Skeleton width="80%" height={28} borderRadius={6} />
        <Skeleton width="70%" height={28} borderRadius={6} />
        <Skeleton width="90%" height={28} borderRadius={6} />
        <Skeleton width="100%" height={1} borderRadius={0} />
        <Skeleton width="60%" height={28} borderRadius={6} />
        <Skeleton width="75%" height={28} borderRadius={6} />
      </div>
      <div className={styles.profileSkeleton}>
        <Skeleton width={32} height={32} circle />
        <div className={styles.userInfoSkeleton}>
          <Skeleton width={80} height={14} borderRadius={4} />
          <Skeleton width={100} height={12} borderRadius={4} />
        </div>
        <Skeleton width={20} height={20} borderRadius={4} />
      </div>
    </div>
  );
};
