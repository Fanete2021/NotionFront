import type { ReactNode } from 'react';
import { DocumentProviders } from '@widgets/document';

interface DocumentLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function DocumentLayout({ children, params }: DocumentLayoutProps) {
  const { id } = await params;
  return <DocumentProviders pageId={id}>{children}</DocumentProviders>;
}
