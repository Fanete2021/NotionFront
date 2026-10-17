'use client';

import { useId } from 'react';
import styles from './PublishPageModal.module.css';
import { PublishPageForm } from '../publish-page-form/PublishPageForm';
import type { PublishPageFormValues } from '../../model/publishPageFormSchema';
import type { Page } from '@shared/const/pageType';
import { Modal } from '@shared/ui/modal';
import { Typography } from '@shared/ui/typography';

type PublishPageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  page: Pick<Page, 'id' | 'title'>;
  onSubmit?: (values: PublishPageFormValues) => void;
};

export const PublishPageModal = ({ isOpen, onClose, page, onSubmit }: PublishPageModalProps) => {
  const formId = useId();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Публикация страницы"
      size="lg"
      className={styles.modal}
      headerDivider
      noBodyPadding
      header={
        <div className={styles.heading}>
          <Typography variant="h2" className={styles.title}>
            Публикация страницы
          </Typography>
          <Typography className={styles.subtitle}>
            Сделайте страницу публично доступной в интернете
          </Typography>
        </div>
      }
    >
      <PublishPageForm
        key={page.id}
        id={formId}
        defaultValues={{ isPublic: true, title: page.title, description: '', slug: page.id }}
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  );
};
