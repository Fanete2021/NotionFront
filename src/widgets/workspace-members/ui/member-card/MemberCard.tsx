import { useDispatch } from 'react-redux';
import styles from './MemberCard.module.css';
import { openModal } from '@/features/change-member-role';
import { WorkspaceMember } from '@/entities/workspace-members';
import { roleLabels, WorkspaceRole, roleColors } from '@shared/const/role';
import { Avatar } from '@shared/ui/avatar';
import { Typography } from '@shared/ui/typography';
import { Badge } from '@shared/ui/badge';
import MoreIcon from '@/shared/assets/icons/more.svg';
import { Button } from '@shared/ui/button';

interface MemberCardProps {
  member: WorkspaceMember;
  canManageMembers?: boolean;
}

export const MemberCard = ({ member, canManageMembers = false }: MemberCardProps) => {
  const { userInfo, role } = member;
  const dispatch = useDispatch();

  const name = `${userInfo.name}`;
  const email = `${userInfo.email}`;
  const roleLabel = roleLabels[role as WorkspaceRole] || role;
  const colors = roleColors[role as WorkspaceRole] || roleColors.VIEWER;

  const handleMoreButtonClick = () => {
    dispatch(openModal(member));
  };

  return (
    <div className={styles.card}>
      <Avatar name={name} size="sm" className={styles.avatar} />
      <div className={styles.info}>
        <Typography variant="text-medium" className={styles.name}>
          {name}
        </Typography>
        <Typography variant="caption" className={styles.email}>
          {email}
        </Typography>
      </div>
      <div className={styles.memberStatus}>
        <Badge text={roleLabel} color={colors.color} bgColor={colors.bgColor} />
        {canManageMembers && (
          <Button variant="clear" className={styles.moreBtn} onClick={handleMoreButtonClick}>
            <MoreIcon className={styles.moreIcon} />
          </Button>
        )}
      </div>
    </div>
  );
};
