import { FC, SVGProps } from 'react';
import { PageType } from '@/entities/page';

export interface SidebarItem {
  id: string;
  title?: string;
  type: 'link' | 'section' | 'group' | 'divider' | 'document';
  href?: string;
  icon?: FC<SVGProps<SVGSVGElement>> | string;
  color?: string;
  children?: SidebarItem[];
  workspaceId?: string;
  projectId?: string;
  documentId?: string;
  documentType?: PageType;
  isRealData?: boolean;
}
