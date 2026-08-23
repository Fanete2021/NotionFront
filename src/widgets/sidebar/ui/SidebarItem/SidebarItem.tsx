import { SidebarItem as SidebarItemType } from '../../model';
import { SidebarDivider } from './components/Divider/SidebarDivider';
import { SidebarLink } from './components/Link/SidebarLink';
import { SidebarSection } from './components/Section/SidebarSection';
import { SidebarGroup } from './components/Group/SidebarGroup';

interface SidebarItemProps {
  item: SidebarItemType;
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
    default:
      return null;
  }
};
