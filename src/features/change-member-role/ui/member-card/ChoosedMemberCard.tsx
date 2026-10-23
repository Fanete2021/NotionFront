import styles from './ChoosedMemberCard.module.css';
import { WorkspaceMember } from '@/entities/workspace-members';
import { roleColors, roleLabels } from '@/shared/const/role';
import { Avatar } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Typography } from '@/shared/ui/typography';

interface ChoosedMemberCardProps {
  member: WorkspaceMember | null;
}

export function ChoosedMemberCard({ member }: ChoosedMemberCardProps) {
  if (!member) return null;

  const { avatarUrl, name, email } = member.userInfo;

  return (
    <div className={styles.card}>
      <div className={styles.memberData}>
        <Avatar name={name} src={avatarUrl} size="md" className={styles.avatar} />
        <div className={styles.info}>
          <Typography variant="text-medium" className={styles.name}>
            {name}
          </Typography>
          <Typography variant="caption" className={styles.email}>
            {email}
          </Typography>
        </div>
      </div>
      <Badge
        text={roleLabels[member.role]}
        color={roleColors[member.role].color}
        bgColor={roleColors[member.role].bgColor}
      />
    </div>
  );
}
