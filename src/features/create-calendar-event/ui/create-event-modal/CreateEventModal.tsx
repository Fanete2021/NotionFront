import React, { useEffect } from 'react';
import { CreateEventForm } from '../create-event-form/CreateEventForm';
import styles from './CreateEventModal.module.css';
import {
  closeCreateEventModal,
  createEventModalReducer,
} from '../../model/slices/createEventModalSlice';
import { selectIsCreateEventModalOpen } from '@entities/calendar';
import { Modal } from '@shared/ui/modal';
import { useAppDispatch, useAppSelector, useAppStore } from '@shared/lib';
import { Typography } from '@shared/ui/Typography';
import { Button } from '@shared/ui/Button';
import PlusIcon from '@shared/assets/icons/plus.svg';

export const CreateEventModal = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const isOpen = useAppSelector(selectIsCreateEventModalOpen);

  useEffect(() => {
    store.injectReducer('createEventModal', createEventModalReducer);
  }, [store]);

  const handleClose = () => {
    dispatch(closeCreateEventModal());
  };

  const header = (
    <Typography className={styles.title} variant="h3">
      Новое событие
    </Typography>
  );

  const footer = (
    <div className={styles.actions}>
      <Button type="button" onClick={handleClose}>
        Отмена
      </Button>
      <Button
        variant="filled"
        type="submit"
        className={styles.submitButton}
        addonLeft={<PlusIcon />}
      >
        Создать событие
      </Button>
    </div>
  );

  return (
    <Modal
      closeButtonVariant="outline"
      header={header}
      footer={footer}
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
    >
      <CreateEventForm />
    </Modal>
  );
};
