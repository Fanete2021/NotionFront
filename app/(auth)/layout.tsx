import { ReactNode } from 'react';
import styles from '@/app/layout.module.css';

const Layout = ({ children }: { children: ReactNode }) => {
  return <main className={styles.container}>{children}</main>;
};

export default Layout;
