import styles from './SidebarSkeleton.module.css';

export const SidebarSkeleton = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.workspaceSwitcher}>
        <div className={styles.workspaceIconSkeleton} />
        <div className={styles.workspaceNameSkeleton} />
      </div>

      <div className={styles.searchSkeleton} />

      <nav className={styles.navigation}>
        <div className={styles.menuItemSkeleton} />
        <div className={styles.menuItemSkeleton} />
        <div className={styles.dividerSkeleton} />
        <div className={styles.menuItemSkeleton} style={{ width: '60%' }} />
        <div className={styles.menuItemSkeleton} style={{ width: '75%' }} />
        <div className={styles.menuItemSkeleton} style={{ width: '85%' }} />
        <div className={styles.menuItemSkeleton} style={{ width: '70%' }} />
        <div className={styles.menuItemSkeleton} style={{ width: '90%' }} />
      </nav>

      <div className={styles.profileSkeleton}>
        <div className={styles.avatarSkeleton} />
        <div className={styles.userInfoSkeleton}>
          <div className={styles.nameSkeleton} />
          <div className={styles.emailSkeleton} />
        </div>
        <div className={styles.moreBtnSkeleton} />
      </div>
    </aside>
  );
};
