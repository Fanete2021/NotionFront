import { ReactNode } from 'react';
import styles from '@/app/layout.module.css';
import { RouteToastCloserProvider } from '@/app/providers/RouteToastProvider';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <RouteToastCloserProvider>
      <section className={styles.container}>{children}</section>
    </RouteToastCloserProvider>
  );
};

export default Layout;
