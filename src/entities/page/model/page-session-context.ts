'use client';

import { createContext, useContext } from 'react';
import type { usePagePresence } from './hooks/usePagePresence';

type PageSessionState = ReturnType<typeof usePagePresence> & {
  pageId: string;
};

export const PageSessionContext = createContext<PageSessionState | null>(null);

export const usePageSession = () => {
  return useContext(PageSessionContext);
};
