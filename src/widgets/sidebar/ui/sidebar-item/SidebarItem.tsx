'use client';

import type { SidebarItemData } from '../../model';
import { SidebarDivider } from './components/divider/SidebarDivider';
import { SidebarSection } from './components/section/SidebarSection';
import { SidebarGroup } from './components/group/SidebarGroup';
import { SidebarLink } from './components/link/SidebarLink';
import { SortableDocument } from '../sortable/SortableDocument';

interface SidebarItemProps {
  item: SidebarItemData;
  level?: number;
}

export const SidebarItem = ({ item, level = 0 }: SidebarItemProps) => {
  switch (item.type) {
    case 'divider':
      return <SidebarDivider />;
    case 'section':
      return <SidebarSection item={item} level={level} />;
    case 'group':
      return <SidebarGroup item={item} level={level} />;
    case 'link':
      return <SidebarLink item={item} level={level} />;
    case 'document':
      return <SortableDocument item={item} level={level} />;
    default:
      return null;
  }
};
