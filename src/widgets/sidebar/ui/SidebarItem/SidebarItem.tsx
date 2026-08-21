import { memo } from 'react';
import { SidebarItem as SidebarItemType } from '../../model';
import { SidebarDivider } from './SidebarDivider';
import { SidebarGroup } from './SidebarGroup';
import { SidebarLink } from './SidebarLink';
import { SidebarSection } from './SidebarSection';

interface SidebarItemProps {
  item: SidebarItemType;
  level?: number;
}

export const SidebarItem = memo(({ item, level = 0 }: SidebarItemProps) => {
  switch (item.type) {
    case 'divider':
      return <SidebarDivider />;
    case 'section':
      return <SidebarSection item={item} level={level} />;
    case 'group':
      return <SidebarGroup item={item} level={level} />;
    case 'link':
      return <SidebarLink item={item} level={level} />;
    default:
      return null;
  }
});

SidebarItem.displayName = 'SidebarItem';
