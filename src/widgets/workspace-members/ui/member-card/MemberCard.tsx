import styles from './MemberCard.module.css';
import { roleLabels, WorkspaceRole, roleColors } from '../../utils/index';
import { WorkspaceMember } from '@/entities/workspace-members';
import { Avatar } from '@/shared/ui/Avatar';
import { Typography } from '@/shared/ui/Typography';
import { Badge } from '@/shared/ui/Badge';
import MoreIcon from '@/shared/assets/icons/more.svg';
import { Button } from '@/shared/ui/Button';

interface MemberCardProps {
  member: WorkspaceMember;
}

export const MemberCard = ({ member }: MemberCardProps) => {
  const { userId, role } = member;

  const name = `Пользователь ${userId.slice(0, 8)}`;
  const email = `user-${userId.slice(0, 8)}@example.com`;
  const roleLabel = roleLabels[role as WorkspaceRole] || role;
  const colors = roleColors[role as WorkspaceRole] || roleColors.MEMBER;

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
        <Button variant="clear" className={styles.moreBtn}>
          <MoreIcon className={styles.moreIcon} />
        </Button>
      </div>
    </div>
  );
};
