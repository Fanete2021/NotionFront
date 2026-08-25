import { MemberCard } from '../member-card/MemberCard';
import styles from './MemberList.module.css';
import { WorkspaceMember } from '@/entities/workspace-members';
import { Typography } from '@/shared/ui/Typography';

interface MemberListProps {
  members: WorkspaceMember[];
}

export const MemberList = ({ members }: MemberListProps) => {
  return (
    <div className={styles.container}>
      <Typography variant="label" className={styles.sectionTitle}>
        Участники
      </Typography>
      <div className={styles.list}>
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};
