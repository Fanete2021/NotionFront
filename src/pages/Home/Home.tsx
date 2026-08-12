import styles from './Home.module.css';
import { Header } from '@widgets/Header';

export const HomePage = () => {
  return (
    <main className={styles.layout}>
      <div className={styles.content}>
        <Header />
      </div>
    </main>
  );
};
