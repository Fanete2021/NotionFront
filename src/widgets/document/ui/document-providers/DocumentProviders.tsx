'use client';

import type { ReactNode } from 'react';
import { PageSessionProvider } from '@/entities/page';

interface DocumentProvidersProps {
  children: ReactNode;
  pageId: string;
}

export const DocumentProviders = ({ children, pageId }: DocumentProvidersProps) => {
  return <PageSessionProvider pageId={pageId}>{children}</PageSessionProvider>;
};
