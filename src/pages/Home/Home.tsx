import { Sidebar } from "@/widgets/Sidebar";
import { Header } from "@widgets/Header";
import styles from './Home.module.css';

export const HomePage = () => {
    return (
        <main className={styles.layout}>
            <Sidebar />
            <div className={styles.content}>
                <Header />
                <section className={styles.page}>
                    <h1>Добро пожаловать</h1>
                    <p>
                        Это базовая структура Feature-Sliced Design для Next.js.
                    </p>
                </section>
            </div>
        </main>
    );
};
