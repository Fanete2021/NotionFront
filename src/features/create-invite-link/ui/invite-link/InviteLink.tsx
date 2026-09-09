import cn from 'classnames';
import styles from './InviteLink.module.css';
import { Typography } from '@/shared/ui/Typography';

interface InviteLinkProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function InviteLink({ title, subtitle, className }: InviteLinkProps) {
  return (
    <div className={cn(styles.inviteLink, className)}>
      <Typography className={styles.title} variant="text-medium">
        {title}
      </Typography>
      <Typography className={styles.subtitle} variant="caption">
        {subtitle}
      </Typography>
    </div>
  );
}
