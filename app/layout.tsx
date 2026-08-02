import styles from '@/app/layout.module.css';
import { Sidebar } from '@/widgets/Sidebar';
import '@shared/styles/global.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className={styles.layout}>
          <Sidebar />

          <main className={styles.content}>{children}</main>
        </div>
      </body>
    </html>
  );
}
