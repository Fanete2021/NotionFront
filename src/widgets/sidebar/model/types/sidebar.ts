import { PageType } from '@/shared/const/pageType';

export interface SidebarItemData {
  id: string;
  title?: string;
  type: 'link' | 'section' | 'group' | 'divider' | 'document';
  href?: string;
  icon?: string;
  color?: string;
  children?: SidebarItemData[];
  workspaceId?: string;
  projectId?: string;
  documentId?: string;
  documentType?: PageType;
  isRealData?: boolean;
}
