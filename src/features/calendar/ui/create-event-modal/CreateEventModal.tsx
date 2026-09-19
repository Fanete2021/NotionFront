import { useEffect } from 'react';
import { CreateEventForm } from '../create-event-form/CreateEventForm';
import { closeCreateEventModal, createEventModalReducer } from '../../slice/createEventModalSlice';
import { selectIsCreateEventModalOpen } from '@entities/calendar';
import { Modal } from '@shared/ui/modal';
import { useAppDispatch, useAppSelector, useAppStore } from '@shared/lib';

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

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <CreateEventForm />
    </Modal>
  );
};
