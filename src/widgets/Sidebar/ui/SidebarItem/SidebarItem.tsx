import { SidebarItem as SidebarItemType } from '../../model/types/sidebar';
import { SidebarDivider } from './SidebarDivider';
import { SidebarGroup } from './SidebarGroup';
import { SidebarLink } from './SidebarLink';
import { SidebarSection } from './SidebarSection';

interface SidebarItemProps {
  item: SidebarItemType;
  level?: number;
}

export function SidebarItem({ item, level = 0 }: SidebarItemProps) {
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
}
