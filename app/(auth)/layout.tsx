import { ReactNode } from 'react';
import styles from '@/app/layout.module.css';

const Layout = ({ children }: { children: ReactNode }) => {
  return <section className={styles.container}>{children}</section>;
};

export default Layout;
