// eslint-disable-next-line fsd/no-relative-imports
import { StoreProvider } from './StoreProvider';
import styles from '@/app/layout.module.css';
import '@shared/styles/global.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>
          <div className={styles.layout}>
            <main className={styles.content}>{children}</main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
