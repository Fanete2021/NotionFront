'use client';

import { SidebarItemData } from '../../model';
import { SidebarDocument } from '../sidebar-item/components/document/SidebarDocument';
import { useSortableItem } from '@features/dnd-sidebar';

interface SortableDocumentProps {
  item: SidebarItemData;
  level: number;
}

export const SortableDocument = ({ item, level }: SortableDocumentProps) => {
  const { attributes, listeners, setNodeRef, style } = useSortableItem({
    id: item.id,
    type: 'document',
  });

  return (
    <div ref={setNodeRef} style={style}>
      <SidebarDocument
        item={item}
        level={level}
        dragListeners={listeners}
        dragAttributes={attributes}
      />
    </div>
  );
};
