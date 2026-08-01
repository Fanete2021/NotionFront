import styles from './Home.module.css';
import { Sidebar } from '@/widgets/Sidebar';
import { Header } from '@widgets/Header';

export const HomePage = () => {
  return (
    <main className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <section className={styles.page}>
          <h1>Добро пожаловать</h1>
          <p>Это базовая структура Feature-Sliced Design для Next.js.</p>
        </section>
      </div>
    </main>
  );
};
