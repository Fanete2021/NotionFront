'use client';

import { GroupHeader } from '../sidebar-item/components/group/components/group-header/GroupHeader';
import type { SidebarItemData } from '../../model';

import { useSortableItem } from '@features/dnd-sidebar';

interface SortableGroupHeaderProps {
  item: SidebarItemData;
  isOpen: boolean;
  isDropdownOpen: boolean;
  onToggle: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onMoreClick: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

export const SortableGroupHeader = ({
  item,
  isOpen,
  isDropdownOpen,
  onToggle,
  onContextMenu,
  onMoreClick,
  children,
}: SortableGroupHeaderProps) => {
  const { attributes, listeners, setNodeRef, style } = useSortableItem({
    id: item.id,
    type: 'group',
  });

  return (
    <div ref={setNodeRef} style={style}>
      <GroupHeader
        item={item}
        isOpen={isOpen}
        isDropdownOpen={isDropdownOpen}
        dragListeners={listeners}
        dragAttributes={attributes}
        onToggle={onToggle}
        onContextMenu={onContextMenu}
        onMoreClick={onMoreClick}
      >
        {children}
      </GroupHeader>
    </div>
  );
};
