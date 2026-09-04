'use client';

import { type MouseEvent, type ReactNode, useEffect, useRef } from 'react';
import classNames from 'classnames';
import styles from './Modal.module.css';
import { useLockBodyScroll } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui/Button';
import { Portal } from '@/shared/ui/portal';
import { Typography } from '@/shared/ui/Typography';
import CloseIcon from '@/shared/assets/icons/x-close-2.svg';

// Ширина панели: sm — 420px, md — 460px, lg — 560px, xl — 760px
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

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
  size?: ModalSize;
  container?: Element | DocumentFragment;
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
  size = 'sm',
  container,
}: ModalProps) => {
  const isMouseDownOnOverlay = useRef(false);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    isMouseDownOnOverlay.current = e.target === e.currentTarget;
  };

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && isMouseDownOnOverlay.current) {
      onClose();
    }
  };

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
    <Portal container={container}>
      <div
        className={styles.overlay}
        onMouseDown={handleOverlayMouseDown}
        onClick={handleOverlayClick}
      >
        <div
          className={classNames(styles.panel, styles[size], className)}
          role="dialog"
          aria-modal="true"
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
              <CloseIcon className={styles.closeIcon} />
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
    </Portal>
  );
};
