'use client';

import type { ReactNode } from 'react';
import classNames from 'classnames';
import styles from '@shared/ui/Modal/Modal.module.css';
import { Button } from '@shared/ui/Button';
import { Typography } from '@shared/ui/Typography';
import CloseIcon from '@shared/assets/icons/x-close-2.svg';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
};

export const Modal = ({
  open,
  onClose,
  children,
  className,
  header,
  title,
  subtitle,
  footer,
}: ModalProps) => {
  if (!open) {
    return null;
  }

  const headerContent =
    header ??
    (title || subtitle ? (
      <div className={styles.headerText}>
        {title ? (
          <Typography variant="text-medium" className={styles.title}>
            {title}
          </Typography>
        ) : null}
        {subtitle ? (
          <Typography variant="caption" className={styles.subtitle}>
            {subtitle}
          </Typography>
        ) : null}
      </div>
    ) : null);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={classNames(styles.panel, className)}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.headerMain}>{headerContent}</div>
          <Button
            type="button"
            variant="clear"
            size="sm"
            square
            className={styles.closeButton}
            aria-label="Закрыть"
            onClick={onClose}
          >
            <CloseIcon className={styles.closeIcon} />
          </Button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
};
