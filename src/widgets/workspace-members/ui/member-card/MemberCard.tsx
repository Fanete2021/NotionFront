import styles from './MemberCard.module.css';
import { WorkspaceMember } from '@/entities/workspace-members';
import { Avatar } from '@/shared/ui/Avatar';
import { Typography } from '@/shared/ui/Typography';
import { Badge } from '@/shared/ui/Badge';
import MoreIcon from '@/shared/assets/icons/more.svg';
import { Button } from '@/shared/ui/Button';
import { BadgeStatus } from '@/shared/ui/Badge/Badge';

// TODO: Вынести в utils.ts
type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'EDITOR' | 'VIEWER';
const roleLabels: Record<WorkspaceRole, string> = {
  OWNER: 'Владелец',
  ADMIN: 'Админ',
  MEMBER: 'Участник',
  EDITOR: 'Редактор',
  VIEWER: 'Наблюдатель',
};

const roleColors: Record<WorkspaceRole, { color: string; bgColor: string }> = {
  OWNER: {
    color: '#6B4EFF',
    bgColor: 'rgba(107, 78, 255, 0.1)',
  },
  ADMIN: {
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
  MEMBER: {
    color: '#6B7280',
    bgColor: 'rgba(107, 114, 128, 0.1)',
  },
  EDITOR: {
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.1)',
  },
  VIEWER: {
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
  },
};

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
