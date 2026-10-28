'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import classNames from 'classnames';
import { SidebarItem } from '../sidebar-item/SidebarItem';
import type { SidebarItemData } from '../../model';
import styles from './SortableGroupItem.module.css';
import { useSidebarDnd } from '@features/dnd-sidebar';

interface SortableGroupItemRenderProps {
  dragListeners?: SyntheticListenerMap;
  dragAttributes?: DraggableAttributes;
}

interface SortableGroupItemProps {
  item: SidebarItemData;
  level: number;
  isOpen: boolean;
  children: React.ReactNode | ((props: SortableGroupItemRenderProps) => React.ReactNode);
}

export const SortableGroupItem = ({ item, level, isOpen, children }: SortableGroupItemProps) => {
  const { activeId, overId, activeType, activeProjectParentId, activePageProjectId } =
    useSidebarDnd();

  const isDraggingDocument = activeType === 'document';
  const isDraggingGroup = activeType === 'group';

  const isOverSelfGroup = overId === `group-${item.id}`;
  const isOverNestZone = overId === `nest-${item.id}`;
  const isOverOwnChild =
    overId !== null &&
    !overId.startsWith('group-') &&
    !overId.startsWith('nest-') &&
    (overId === item.id ||
      (item.children?.some((child: SidebarItemData) => child.id === overId) ?? false));

  const isDraggingSelf = activeId === item.id;

  const isActiveChildOfThis =
    (isDraggingGroup && activeProjectParentId === item.id) ||
    (isDraggingDocument && activePageProjectId === item.id);

  const showOutdentZone = isActiveChildOfThis && !isDraggingSelf;

  const isOverThisGroup = (isOverSelfGroup || isOverOwnChild) && !isDraggingSelf;
  const showHighlight = isOverThisGroup && !isActiveChildOfThis;

  const showNestZone =
    (isDraggingGroup || isDraggingDocument) &&
    !isDraggingSelf &&
    !isActiveChildOfThis &&
    (isOverThisGroup || isOverNestZone);

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { type: 'group' },
    animateLayoutChanges: () => false,
  });

  const { setNodeRef: setOutdentDroppableRef, isOver: isOverOutdent } = useDroppable({
    id: `outdent-${item.id}`,
    data: {
      type: 'outdent',
      projectId: item.id,
      level,
    },
    disabled: !showOutdentZone,
  });

  const { setNodeRef: setNestDroppableRef, isOver: isOverNest } = useDroppable({
    id: `nest-${item.id}`,
    data: { type: 'nest', projectId: item.id, level },
  });

  const { setNodeRef: setGroupDroppableRef } = useDroppable({
    id: `group-${item.id}`,
    data: { type: 'group', projectId: item.id, level, isOpen },
    disabled: isOpen,
  });

  const setRefs = (node: HTMLDivElement | null) => {
    setSortableRef(node);
    if (!isOpen) setGroupDroppableRef(node);
  };

  const sortableStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const childrenList = item.children ?? [];
  const hasChildren = childrenList.length > 0;

  const content =
    typeof children === 'function'
      ? children({ dragListeners: listeners, dragAttributes: attributes })
      : children;

  return (
    <div
      ref={setRefs}
      className={classNames(styles.groupWrapper, {
        [styles.groupWrapperOver]: showHighlight,
      })}
      style={sortableStyle}
    >
      {content}

      {showOutdentZone && (
        <div
          ref={setOutdentDroppableRef}
          className={classNames(styles.outdentZone, {
            [styles.outdentZoneOver]: isOverOutdent,
          })}
        >
          <span>Вынести из «{item.title}»</span>
        </div>
      )}

      {showNestZone && (
        <div
          ref={setNestDroppableRef}
          className={classNames(styles.nestZone, { [styles.nestZoneOver]: isOverNest })}
        >
          Вложить в «{item.title}»
        </div>
      )}

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
