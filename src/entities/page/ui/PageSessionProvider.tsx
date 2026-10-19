'use client';

import { ReactNode } from 'react';
import { PageSessionContext } from '../model/page-session-context';
import { usePagePresence } from '../model/hooks/usePagePresence';

interface PageSessionProviderProps {
  pageId: string;
  children: ReactNode;
}

export const PageSessionProvider = ({ pageId, children }: PageSessionProviderProps) => {
  const presence = usePagePresence(pageId);

  return (
    <PageSessionContext.Provider value={{ pageId, ...presence }}>
      {children}
    </PageSessionContext.Provider>
  );
};
