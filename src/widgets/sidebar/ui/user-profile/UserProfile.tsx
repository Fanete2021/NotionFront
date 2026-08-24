import styles from './UserProfile.module.css';
import { Avatar } from '@/shared/ui/Avatar';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

interface UserProfileProps {
  name: string;
  email: string;
}

export function UserProfile({ name, email }: UserProfileProps) {
  return (
    <div className={styles.profile}>
      <Avatar name={name} size="lg" className={styles.avatar} />

      <div className={styles.userInfo}>
        <Typography variant="label" className={styles.name}>
          {name}
        </Typography>
        <Typography variant="caption" className={styles.email}>
          {email}
        </Typography>
      </div>

      <Button size="sm" variant="clear" className={styles.moreBtn}>
        •••
      </Button>
    </div>
  );
}
