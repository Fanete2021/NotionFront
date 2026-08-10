import { FC, SVGProps } from 'react';

export interface SidebarItem {
  id: string;
  title?: string;
  type: 'link' | 'section' | 'group' | 'divider';
  href?: string;
  icon?: FC<SVGProps<SVGSVGElement>> | string;
  color?: string;
  children?: SidebarItem[];
  workspaceId?: string;
  projectId?: string;
  isRealData?: boolean;
}
