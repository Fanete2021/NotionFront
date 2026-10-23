import { useEffect, useState } from 'react';
import styles from './ChangeMemberRoleModal.module.css';
import { ChoosedMemberCard } from '../member-card/ChoosedMemberCard';
import { SaveChoosedRoleButton } from '@/features/change-member-role/ui/save-choosed-role-button/SaveChoosedRoleButton';
import { ChooseRoleVariant } from '../choose-role-variant/ChooseRoleVariant';
import { InfoBlock } from '@/features/change-member-role/ui/info-block/InfoBlock';
import { useUpdateMemberRoleMutation, WorkspaceMember } from '@/entities/workspace-members';
import { WorkspaceRole } from '@/entities/workspace-members';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/typography';
import { useAppSelector, useMutationWithError } from '@/shared/lib';
import { HTTP_STATUS } from '@/shared/const/httpStatus';
import { FormError } from '@/shared/ui/form-error';

interface ChangeMemberRoleModalProps {
  member: WorkspaceMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ChangeMemberRoleModal({ member, isOpen, onClose }: ChangeMemberRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<WorkspaceRole | null>(null);
  const currentWorkspaceId = useAppSelector((state) => state.currentWorkspace.id);

  const {
    execute: updateMemberRole,
    isLoading,
    error,
    fieldErrors,
  } = useMutationWithError(useUpdateMemberRoleMutation, {
    onSuccess: () => onClose(),
    fieldMap: {
      [HTTP_STATUS.FORBIDDEN]: {
        field: 'root',
        message: 'Вы не являетесь участником этого воркспейса',
      },
      [HTTP_STATUS.UNAUTHORIZED]: {
        field: 'root',
        message: 'Необходима авторизация',
      },
      [HTTP_STATUS.INTERNAL_SERVER_ERROR]: {
        field: 'root',
        message: 'Не удалось изменить роль. Попробуйте позже',
      },
    },
  });

  useEffect(() => {
    // eslint-disable-next-line
    setSelectedRole(member?.role ?? null);
  }, [member]);

  const handleCancelButtonAction = () => {
    onClose();
  };

  const handleSaveButtonAction = async () => {
    if (!member || !selectedRole || !currentWorkspaceId) return;

    await updateMemberRole({
      workspaceId: currentWorkspaceId,
      userId: member.userInfo.id,
      body: { role: selectedRole },
    });
  };

  if (!member) return null;

  return (
    <Modal
      className={styles.modal}
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      noBodyPadding
      header={<Typography className={styles.header}>Изменить роль участника</Typography>}
      footerDivider
      footer={
        <div className={styles.buttons}>
          <Button variant="outline" onClick={handleCancelButtonAction}>
            Отмена
          </Button>
          <SaveChoosedRoleButton
            onClick={handleSaveButtonAction}
            disabled={isLoading || !selectedRole || selectedRole === member.role}
          >
            Сохранить
          </SaveChoosedRoleButton>
        </div>
      }
    >
      <div className={styles.layout}>
        <ChoosedMemberCard member={member} />
        <ChooseRoleVariant selectedRole={selectedRole} onSelect={setSelectedRole} />
        <InfoBlock />
        <FormError message={fieldErrors.root ?? error} />
      </div>
    </Modal>
  );
}
