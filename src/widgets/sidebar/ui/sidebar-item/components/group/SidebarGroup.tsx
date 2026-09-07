'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { SidebarItem as SidebarItemType } from '../../../../model';
import styles from './SidebarGroup.module.css';
import { renderIcon } from '../../utils';
import { SidebarItem } from '@/widgets/sidebar';
import { openCreateDocumentModal } from '@/features/create-document';
import { openEditProjectModal } from '@/features/manage-project';
import { useDeleteProjectMutation } from '@/entities/project';
import ChevronRightIcon from '@/shared/assets/icons/chevron-right-2.svg';
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg';
import PencilIcon from '@/shared/assets/icons/pencil-3.svg';
import TrashIcon from '@/shared/assets/icons/trash.svg';
import DocsIcon from '@/shared/assets/icons/docs.svg';
import DotsIcon from '@/shared/assets/icons/dots.svg';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';
import { useAppDispatch } from '@/shared/lib';

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
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const [deleteProject] = useDeleteProjectMutation();

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
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        moreRef.current &&
        !moreRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

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
  }, [isDropdownOpen]);

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

  return (
    <>
      <div className={styles.group} onContextMenu={handleContextMenu}>
        <div className={styles.groupHeader} onClick={handleToggle}>
          <Button
            variant="clear"
            className={styles.arrowButton}
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
          >
            {isOpen ? (
              <ChevronDownIcon className={styles.arrow} />
            ) : (
              <ChevronRightIcon className={styles.arrow} />
            )}
          </Button>

          {renderIcon(item, styles)}

          {!item.icon && item.color && (
            <span className={styles.colorDot} style={{ backgroundColor: item.color }} />
          )}

          <Typography className={styles.title} variant="label">
            {item.title}
          </Typography>

          <div className={styles.moreWrapper} ref={moreRef}>
            <Button size="sm" variant="clear" className={styles.moreBtn} onClick={handleMoreClick}>
              <DotsIcon />
            </Button>

            {isDropdownOpen && dropdownPosition && (
              <div
                ref={dropdownRef}
                className={styles.dropdown}
                style={{
                  position: 'fixed',
                  top: dropdownPosition.top,
                  right: dropdownPosition.right,
                }}
              >
                <Button variant="clear" className={styles.dropdownItem} onClick={handleEdit}>
                  <PencilIcon className={styles.menuIcon} />
                  Редактировать
                </Button>
                <Button
                  variant="clear"
                  className={`${styles.dropdownItem} ${styles.menuItemDanger}`}
                  onClick={handleDelete}
                >
                  <TrashIcon className={styles.menuIcon} />
                  Удалить
                </Button>
              </div>
            )}
          </div>
        </div>

        {isOpen && item.children && item.children.length > 0 && (
          <div className={styles.children}>
            {item.children?.map((child) => (
              <SidebarItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
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
          <Button variant="clear" className={styles.contextMenuItem} onClick={handleCreateDocument}>
            <DocsIcon className={styles.menuIcon} />
            Создать документ
          </Button>
        </div>
      )}
    </>
  );
}
