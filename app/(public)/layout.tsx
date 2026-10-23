import type { ReactNode } from 'react';
import styles from '@/app/public-layout.module.css';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <div className={styles.layout}>{children}</div>;
}
