import { Typography } from '../Typography';
import styles from './Loader.module.css';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const Loader = ({ size = 'md', text = 'Загрузка...', fullScreen = true }: LoaderProps) => {
  const sizeMap = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  };

  const content = (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${sizeMap[size]}`}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
      {text && <Typography variant="text-alt">{text}</Typography>}
    </div>
  );

  if (fullScreen) {
    return <div className={styles.fullScreen}>{content}</div>;
  }

  return content;
};
