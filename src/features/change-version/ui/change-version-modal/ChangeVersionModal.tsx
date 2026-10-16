'use client';

import styles from './ChangeVersionModal.module.css';
import { VersionHistory } from '../version-history/VersionHistory';
import type { PageContent } from '@/entities/page';
import type { Page } from '@/shared/const/pageType';
import { Modal } from '@/shared/ui/modal';
import { Typography } from '@shared/ui/typography';

type ChangeVersionModalProps = {
  open: boolean;
  onClose: () => void;
  page: Page;
  onRestored?: (content: PageContent) => void;
};

export const ChangeVersionModal = ({
  open,
  onClose,
  page,
  onRestored,
}: ChangeVersionModalProps) => {
  const handleRestored = (content: PageContent) => {
    onRestored?.(content);
    onClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="xl"
      noBodyPadding
      headerDivider
      header={
        <div className={styles.heading}>
          <div className={styles.headingIcon} aria-hidden />
          <div className={styles.headingText}>
            <Typography variant="text-regular" className={styles.headingTitle}>
              История изменений
            </Typography>
            <Typography variant="caption" className={styles.headingSubtitle}>
              {page.title}
            </Typography>
          </div>
        </div>
      }
    >
      <div className={styles.layout}>
        <VersionHistory page={page} onRestored={handleRestored} />
      </div>
    </Modal>
  );
};
