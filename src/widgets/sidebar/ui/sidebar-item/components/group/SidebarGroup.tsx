'use client';

import { useState, useCallback, useEffect } from 'react';
import { SidebarItemData } from '../../../../model';
import styles from './SidebarGroup.module.css';
import { GroupDropdown } from './components/group-dropdown/GroupDropdown';
import { GroupContextMenu } from './components/group-context-menu/GroupContextMenu';
import { SortableGroupHeader } from '../../../sortable/SortableGroupHeader';
import { SortableGroupItem } from '../../../sortable/SortableGroupItem';
import { openCreateDocumentModal } from '@/features/manage-document';
import { openEditProjectModal } from '@/features/manage-project';
import { toggleGroup } from '@/features/dnd-sidebar';
import { useDeleteProjectMutation } from '@/entities/project';
import { useAppDispatch, useDismissibleLayer, useAppSelector } from '@/shared/lib';

const DROPDOWN_OFFSET_BOTTOM = 4;
const DROPDOWN_SHIFT_RIGHT = 140;

interface SidebarGroupProps {
  item: SidebarItemData;
  level: number;
}

export function SidebarGroup({ item, level }: SidebarGroupProps) {
  const workspaceId = useAppSelector((state) => state.currentWorkspace.id) ?? '';
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => (state.sidebarUi.openGroupIds ?? []).includes(item.id));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; right: number } | null>(
    null,
  );

  const moreRef = useDismissibleLayer<HTMLDivElement>({
    enabled: isDropdownOpen,
    onDismiss: () => setIsDropdownOpen(false),
  });

  const [deleteProject] = useDeleteProjectMutation();

  const handleToggle = useCallback(() => dispatch(toggleGroup(item.id)), [dispatch, item.id]);

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
        icon: item.icon,
      }),
    );
  }, [dispatch, item.id, item.title, item.color, item.icon]);

  const handleDelete = useCallback(async () => {
    setIsDropdownOpen(false);
    if (!confirm(`Удалить проект "${item.title}"?`)) return;
    try {
      await deleteProject({ id: item.id, workspaceId }).unwrap();
    } catch (err) {
      console.error('Ошибка удаления проекта:', err);
    }
  }, [deleteProject, item.id, item.title, workspaceId]);

  return (
    <>
      <SortableGroupItem item={item} level={level} isOpen={isOpen}>
        <div className={styles.group} onClick={handleToggle}>
          <SortableGroupHeader
            item={item}
            isOpen={isOpen}
            isDropdownOpen={isDropdownOpen}
            onToggle={handleToggle}
            onContextMenu={handleContextMenu}
            onMoreClick={handleMoreClick}
          >
            <GroupDropdown
              isOpen={isDropdownOpen}
              position={dropdownPosition}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </SortableGroupHeader>
        </div>
      </SortableGroupItem>

      <GroupContextMenu
        isOpen={contextMenu !== null}
        position={contextMenu}
        onCreateDocument={handleCreateDocument}
        onClose={() => setContextMenu(null)}
      />
    </>
  );
}
