'use client';

import styles from './ChangeVersionModal.module.css';
import { VersionList } from '../version-list/VersionList';
import { VersionPreview } from '../version-preview/VersionPreview';
import { Modal } from '@shared/ui/Modal';
import { Typography } from '@shared/ui/Typography';

type ChangeVersionModalProps = {
  open: boolean;
  onClose: () => void;
};

export const ChangeVersionModal = ({ open, onClose }: ChangeVersionModalProps) => {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      headerDivider
      header={
        <div className={styles.heading}>
          <div className={styles.headingIcon} aria-hidden />
          <div className={styles.headingText}>
            <Typography variant="text-regular" className={styles.headingTitle}>
              История изменений
            </Typography>
            <Typography variant="label" className={styles.headingSubtitle}>
              Дизайн-система — Компоненты
            </Typography>
          </div>
        </div>
      }
    >
      <div className={styles.layout}>
        <VersionList />
        <VersionPreview />
      </div>
    </Modal>
  );
};
