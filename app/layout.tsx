import { Inter } from 'next/font/google';
import { StoreProvider } from '@/app/providers/StoreProvider';
import '@shared/styles/global.css';
import { Toaster } from '@shared/ui/toast';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <StoreProvider>{children}</StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
