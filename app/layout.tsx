import { StoreProvider } from '@/app/providers/StoreProvider';
import '@shared/styles/global.css';
import { Toaster } from '@shared/ui/toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>{children}</StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
