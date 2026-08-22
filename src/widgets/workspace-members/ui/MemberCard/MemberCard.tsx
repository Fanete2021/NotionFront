import styles from './MemberCard.module.css';
import { WorkspaceMember } from '@/entities/workspace-members';
import { Avatar } from '@/shared/ui/Avatar';
import { Typography } from '@/shared/ui/Typography';
import { Badge } from '@/shared/ui/Badge';

type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'EDITOR' | 'VIEWER';
const roleLabels: Record<WorkspaceRole, string> = {
  OWNER: 'Владелец',
  ADMIN: 'Админ',
  MEMBER: 'Участник',
  EDITOR: 'Редактор',
  VIEWER: 'Наблюдатель',
};

interface MemberCardProps {
  member: WorkspaceMember;
}

export const MemberCard = ({ member }: MemberCardProps) => {
  const { userId, role } = member;

  const name = `Пользователь ${userId.slice(0, 8)}`;
  const email = `user-${userId.slice(0, 8)}@example.com`;
  const roleLabel = roleLabels[role as WorkspaceRole] || role;

  return (
    <div className={styles.card}>
      <Avatar name={name} size="md" className={styles.avatar} />
      <div className={styles.info}>
        <Typography variant="text-medium" className={styles.name}>
          {name}
        </Typography>
        <Typography variant="caption" className={styles.email}>
          {email}
        </Typography>
      </div>
      <Badge status="verified" text={roleLabel} />
    </div>
  );
};
