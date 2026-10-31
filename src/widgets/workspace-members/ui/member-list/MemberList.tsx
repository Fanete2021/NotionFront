import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { MemberCard } from '../member-card/MemberCard';
import styles from './MemberList.module.css';
import { ChangeMemberRoleModal } from '@features/change-member-role';
import { closeModal } from '@features/change-member-role';
import { changeMemberRoleReducer } from '@/features/change-member-role';
import {
  selectChoosedMember,
  selectIsChangeMemberRoleModalOpen,
  WorkspaceMember,
} from '@/entities/workspace-members';
import { Typography } from '@shared/ui/typography';
import { useAppSelector, useAppStore } from '@/shared/lib';

interface MemberListProps {
  members: WorkspaceMember[];
  canManageMembers?: boolean;
}

export const MemberList = ({ members, canManageMembers = false }: MemberListProps) => {
  const store = useAppStore();
  const isChangeMemberRoleModalOpen = useAppSelector(selectIsChangeMemberRoleModalOpen);
  const member = useAppSelector(selectChoosedMember);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(closeModal());
  };

  useEffect(() => {
    store.injectReducer('changeMemberRole', changeMemberRoleReducer);
  }, [store]);

  return (
    <div className={styles.container}>
      <Typography variant="label" className={styles.sectionTitle}>
        Участники
      </Typography>
      <div className={styles.list}>
        {members.map((member) => (
          <MemberCard key={member.id} member={member} canManageMembers={canManageMembers} />
        ))}
      </div>
      <ChangeMemberRoleModal
        isOpen={isChangeMemberRoleModalOpen}
        member={member}
        onClose={onClose}
      />
    </div>
  );
};
