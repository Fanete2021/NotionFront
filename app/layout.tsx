// eslint-disable-next-line fsd/no-relative-imports
import { StoreProvider } from './StoreProvider';
import '@shared/styles/global.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
