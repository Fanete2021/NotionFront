'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from '@shared/ui/toast';

export const RouteToastCloserProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/login') {
      toast.close();
    }
  }, [pathname, close]);

  return children;
};
