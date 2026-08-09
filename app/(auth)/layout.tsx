import { ReactNode } from 'react';
// eslint-disable-next-line fsd/no-relative-imports
import styles from './layout.module.css';

const Layout = ({ children }: { children: ReactNode }) => {
  return <section className={styles.container}>{children}</section>;
};

export default Layout;
