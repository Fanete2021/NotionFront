import styles from './DocumentBodySkeleton.module.css';

export const DocumentBodySkeleton = () => (
  <div className={styles.container}>
    <div className={styles.title} />
    <div className={styles.line} />
    <div className={styles.line} />
    <div className={styles.line} />
  </div>
);
