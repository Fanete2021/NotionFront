'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { SidebarItem as SidebarItemType } from '../../../../model';
import styles from './SidebarDocument.module.css';
import { SidebarLink } from '../link/SidebarLink';
import { openEditDocumentModal } from '@/features/manage-document';
import { useDeletePageMutation } from '@/entities/page';
import PencilIcon from '@/shared/assets/icons/pencil-3.svg';
import TrashIcon from '@/shared/assets/icons/trash-2.svg';
import { Button } from '@/shared/ui/Button';
import { useAppDispatch, useAppSelector } from '@/shared/lib';

interface SidebarDocumentProps {
  item: SidebarItemType;
  level: number;
}

export function SidebarDocument({ item, level }: SidebarDocumentProps) {
  const dispatch = useAppDispatch();
  const workspaceId = useAppSelector((state) => state.currentWorkspace.id);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [deletePage] = useDeletePageMutation();

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    if (!contextMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu]);

  const handleEdit = useCallback(() => {
    setContextMenu(null);
    dispatch(
      openEditDocumentModal({
        documentId: item.id,
        title: item.title ?? '',
        icon: typeof item.icon === 'string' ? item.icon : undefined,
        type: item.documentType,
      }),
    );
  }, [dispatch, item.id, item.title, item.icon, item.documentType]);

  const handleDelete = useCallback(async () => {
    setContextMenu(null);
    if (!workspaceId) return;
    if (!confirm(`Удалить документ "${item.title}"?`)) return;

    try {
      await deletePage({ id: item.id, workspaceId }).unwrap();
    } catch (err) {
      console.error('Ошибка удаления документа:', err);
    }
  }, [deletePage, item.id, item.title, workspaceId]);

  return (
    <>
      <div className={styles.document} onContextMenu={handleContextMenu}>
        <SidebarLink item={item} level={level} />
      </div>

      {contextMenu && (
        <div
          ref={menuRef}
          className={styles.contextMenu}
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          <Button variant="clear" className={styles.contextMenuItem} onClick={handleEdit}>
            <PencilIcon className={styles.menuIcon} />
            Редактировать
          </Button>

          <div className={styles.menuDivider} />

          <Button
            variant="clear"
            className={`${styles.contextMenuItem} ${styles.menuItemDanger}`}
            onClick={handleDelete}
          >
            <TrashIcon className={styles.menuIcon} />
            Удалить
          </Button>
        </div>
      )}
    </>
  );
}
