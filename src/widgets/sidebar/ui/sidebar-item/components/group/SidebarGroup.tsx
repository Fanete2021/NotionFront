'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import classNames from 'classnames';
import { SidebarItem as SidebarItemType } from '../../../../model';
import { SidebarItem } from '../../../../../sidebar';
import styles from './SidebarGroup.module.css';
import { useSidebarDnd } from '../../../sidebar/lib/SidebarDndContext';
import { SortableGroupHeader } from '../../../sidebar-item/components/group/components/sortable-group-header/SortableGroupHeader';
import { GroupContextMenu } from '../../../sidebar-item/components/group/components/group-context-menu/GroupContextMenu';
import { openCreateDocumentModal } from '@/features/manage-document';
import { openEditProjectModal } from '@/features/manage-project';
import { useDeleteProjectMutation } from '@/entities/project';
import { useAppDispatch, useDismissibleLayer } from '@/shared/lib';

const DROPDOWN_OFFSET_BOTTOM = 4;
const DROPDOWN_SHIFT_RIGHT = 140;

interface SidebarGroupProps {
  item: SidebarItemType;
  level: number;
}

export function SidebarGroup({ item, level }: SidebarGroupProps) {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; right: number } | null>(
    null,
  );

  const { activeId: activeIdStr, overId: overIdStr } = useSidebarDnd();

  const isOverSelfGroup = overIdStr === `group-${item.id}`;
  const isOverOwnChild =
    overIdStr !== null &&
    !overIdStr.startsWith('group-') &&
    (overIdStr === item.id || (item.children?.some((child) => child.id === overIdStr) ?? false));
  const isDraggingSelf = overIdStr !== null && overIdStr === activeIdStr;
  const isOverThisGroup = (isOverSelfGroup || isOverOwnChild) && !isDraggingSelf;

  const moreRef = useDismissibleLayer<HTMLDivElement>({
    enabled: isDropdownOpen,
    onDismiss: () => setIsDropdownOpen(false),
  });

  const [deleteProject] = useDeleteProjectMutation();

  const { setNodeRef: setGroupDroppableRef } = useDroppable({
    id: `group-${item.id}`,
    data: { type: 'group', projectId: item.id },
  });

  const handleToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMoreClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isDropdownOpen && moreRef.current) {
      const rect = moreRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + DROPDOWN_OFFSET_BOTTOM,
        right: window.innerWidth - rect.right - DROPDOWN_SHIFT_RIGHT,
      });
    } else {
      setDropdownPosition(null);
    }
  }, [isDropdownOpen, moreRef]);

  const handleCreateDocument = useCallback(() => {
    setContextMenu(null);
    dispatch(openCreateDocumentModal({ projectId: item.id }));
  }, [dispatch, item.id]);

  const handleEdit = useCallback(() => {
    setIsDropdownOpen(false);
    dispatch(
      openEditProjectModal({
        projectId: item.id,
        projectName: item.title || '',
        color: item.color,
        icon: typeof item.icon === 'string' ? item.icon : undefined,
      }),
    );
  }, [dispatch, item.id, item.title, item.color, item.icon]);

  const handleDelete = useCallback(async () => {
    setIsDropdownOpen(false);
    if (!confirm(`Удалить проект "${item.title}"?`)) return;
    try {
      await deleteProject(item.id).unwrap();
    } catch (err) {
      console.error('Ошибка удаления проекта:', err);
    }
  }, [deleteProject, item.id, item.title]);

  const children = item.children ?? [];
  const hasChildren = children.length > 0;

  return (
    <>
      <div
        ref={setGroupDroppableRef}
        className={classNames(styles.groupWrapper, {
          [styles.groupWrapperOver]: isOverThisGroup,
        })}
      >
        <div className={styles.group} onClick={handleToggle}>
          <SortableGroupHeader
            ref={moreRef}
            item={item}
            isOpen={isOpen}
            isDropdownOpen={isDropdownOpen}
            dropdownPosition={dropdownPosition}
            onToggle={handleToggle}
            onContextMenu={handleContextMenu}
            onMoreClick={handleMoreClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {isOpen && hasChildren && (
          <SortableContext items={children.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className={styles.children}>
              {children.map((child) => (
                <SidebarItem key={child.id} item={child} level={level + 1} />
              ))}
            </div>
          </SortableContext>
        )}

        {isOpen && !hasChildren && isOverThisGroup && (
          <div className={styles.emptyPlaceholder}>
            {isOverThisGroup ? 'Отпустите, чтобы переместить' : ''}
          </div>
        )}
      </div>

      <GroupContextMenu
        isOpen={contextMenu !== null}
        position={contextMenu}
        onCreateDocument={handleCreateDocument}
      />
    </>
  );
}
