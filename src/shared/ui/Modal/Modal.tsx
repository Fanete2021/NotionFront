'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import classNames from 'classnames';
import styles from './Modal.module.css';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';
import CloseIcon2 from '@/shared/assets/icons/x-close-2.svg';
import CloseIcon from '@/shared/assets/icons/x-close.svg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  header?: ReactNode;
  footer?: ReactNode;
  headerDivider?: boolean;
  footerDivider?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  title,
  subtitle,
  header,
  footer,
  headerDivider = false,
  footerDivider = false,
}: ModalProps) => {
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

  const headerContent =
    header ??
    (title || subtitle ? (
      <div className={styles.headerText}>
        {title && (
          <Typography variant="text-medium" className={styles.title}>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="caption" className={styles.subtitle}>
            {subtitle}
          </Typography>
        )}
      </div>
    ) : null);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={classNames(styles.panel, className)}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classNames(styles.header, { [styles.withDivider]: headerDivider })}>
          <div className={styles.headerMain}>{headerContent}</div>
          <Button
            type="button"
            variant="clear"
            size="sm"
            className={styles.closeButton}
            aria-label="Закрыть"
            onClick={onClose}
          >
            {footer ? (
              <CloseIcon className={styles.closeIcon} />
            ) : (
              <CloseIcon2 className={styles.closeIcon} />
            )}
          </Button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && (
          <div className={classNames(styles.footer, { [styles.withDivider]: footerDivider })}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
