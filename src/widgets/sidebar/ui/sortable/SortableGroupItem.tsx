'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import classNames from 'classnames';
import { SidebarItem } from '../sidebar-item/SidebarItem';
import type { SidebarItemData } from '../../model';
import styles from './SortableGroupItem.module.css';
import { useSidebarDnd } from '@features/dnd-sidebar';

interface SortableGroupItemProps {
  item: SidebarItemData;
  level: number;
  isOpen: boolean;
  children: React.ReactNode;
}

export const SortableGroupItem = ({ item, level, isOpen, children }: SortableGroupItemProps) => {
  const { activeId, overId, activeType } = useSidebarDnd();

  const isDraggingDocument = activeType === 'document';

  const isOverSelfGroup = overId === `group-${item.id}`;
  const isOverOwnChild =
    overId !== null &&
    !overId.startsWith('group-') &&
    (overId === item.id ||
      (item.children?.some((child: SidebarItemData) => child.id === overId) ?? false));

  const isDraggingSelf = activeId === item.id;

  const isOverThisGroup = (isOverSelfGroup || isOverOwnChild) && !isDraggingSelf;

  const { setNodeRef: setGroupDroppableRef } = useDroppable({
    id: `group-${item.id}`,
    data: { type: 'group', projectId: item.id },
  });

  const childrenList = item.children ?? [];
  const hasChildren = childrenList.length > 0;

  return (
    <div
      ref={setGroupDroppableRef}
      className={classNames(styles.groupWrapper, {
        [styles.groupWrapperOver]: isOverThisGroup,
      })}
    >
      {children}

      {isOpen && hasChildren && (
        <SortableContext
          items={childrenList.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.children}>
            {childrenList.map((child) => (
              <SidebarItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        </SortableContext>
      )}

      {isOpen && !hasChildren && isOverThisGroup && isDraggingDocument && (
        <div className={styles.emptyPlaceholder}>Отпустите, чтобы переместить</div>
      )}
    </div>
  );
};
