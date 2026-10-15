import cn from 'classnames';
import styles from './InviteLink.module.css';

interface InviteLinkProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function InviteLink({ title, subtitle, className }: InviteLinkProps) {
  return (
    <span className={cn(styles.inviteLink, className)}>
      <span className={styles.title}>{title}</span>
      <span className={styles.subtitle}>{subtitle}</span>
    </span>
  );
}
