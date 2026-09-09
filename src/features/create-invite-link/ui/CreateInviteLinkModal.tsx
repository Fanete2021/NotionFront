'use client';

import { useEffect } from 'react';
import styles from './CreateInviteLinkModal.module.css';
import { closeInviteLinkModal, inviteLinkModalReducer } from '../slice/inviteLinkModalSlice';
import { CreateInviteLinkForm } from './create-invite-link-form/CreateInviteLinkForm';
import { selectIsModalOpen, selectCreateInviteLinkWorkspaceId } from '@/entities/workspace-invite';
import { WorkspaceMember } from '@/entities/workspace-members';
import { Modal } from '@/shared/ui/modal';
import { useAppSelector, useAppDispatch, useAppStore } from '@/shared/lib';

interface CreateInviteLinkModalProps {
  members: WorkspaceMember[];
}

export function CreateInviteLinkModal({ members }: CreateInviteLinkModalProps) {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const isOpen = useAppSelector(selectIsModalOpen);
  const workspaceId = useAppSelector(selectCreateInviteLinkWorkspaceId);
  const curRole = members.find((member) => member.workspaceId === workspaceId)?.role;

  useEffect(() => {
    store.injectReducer('inviteLinkModal', inviteLinkModalReducer);
  }, [store]);

  const handleClose = () => {
    dispatch(closeInviteLinkModal());
  };

  return (
    <Modal
      className={styles.modal}
      isOpen={isOpen}
      onClose={handleClose}
      title="Создать ссылку для вступления"
      headerDivider
      footerDivider
      size="md"
    >
      {workspaceId && (
        <CreateInviteLinkForm
          workspaceId={workspaceId}
          onSuccess={handleClose}
          onCancel={handleClose}
          curRole={curRole}
        />
      )}
    </Modal>
  );
}
