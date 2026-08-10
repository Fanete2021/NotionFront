'use client';

import { FC, ReactNode, useEffect, useRef } from 'react';
import classNames from 'classnames';
import styles from './Modal.module.css';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import CloseIcon from '@/shared/assets/icons/x-close.svg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div
        className={classNames(styles.modal, className)}
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && (
          <div className={styles.header}>
            <Typography variant="text-modal" className={styles.title}>
              {title}
            </Typography>
            <Button variant="clear" square className={styles.closeButton} onClick={onClose}>
              <CloseIcon className={styles.icon} />
            </Button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};
