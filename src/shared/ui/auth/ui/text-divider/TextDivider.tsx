import { ReactNode } from 'react';
import styles from './TextDivider.module.css';
import { Typography } from '@shared/ui/Typography';

interface TextDividerProps {
  children: ReactNode;
}

export const TextDivider = ({ children }: TextDividerProps) => {
  return (
    <div className={styles.textDivider}>
      <div className={styles.line}></div>
      <Typography className={styles.text}>{children}</Typography>
      <div className={styles.line}></div>
    </div>
  );
};
