import { useEffect } from 'react';
import { CreateEventForm } from '../create-event-form/CreateEventForm';
import {
  closeCreateEventModal,
  createEventModalReducer,
} from '../../model/slices/createEventModalSlice';
import { selectIsCreateEventModalOpen, selectEditingEvent } from '@entities/calendar';
import { Modal } from '@shared/ui/modal';
import { useAppDispatch, useAppSelector, useAppStore } from '@shared/lib';
import { Typography } from '@shared/ui/Typography';

export const CreateEventModal = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const isOpen = useAppSelector(selectIsCreateEventModalOpen);
  const editingEvent = useAppSelector(selectEditingEvent);

  useEffect(() => {
    store.injectReducer('createEventModal', createEventModalReducer);
  }, [store]);

  const handleClose = () => {
    dispatch(closeCreateEventModal());
  };

  const header = (
    <Typography variant="h3">{editingEvent ? 'Редактировать событие' : 'Новое событие'}</Typography>
  );

  return (
    <Modal
      closeButtonVariant="outline"
      header={header}
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
    >
      <CreateEventForm event={editingEvent ?? undefined} />
    </Modal>
  );
};
