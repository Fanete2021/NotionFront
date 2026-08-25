import styles from './InviteLinks.module.css';
import { InviteLink } from '@/widgets/workspace-members/ui/invite-link/InviteLink';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import GlobusIcon from '@/shared/assets/icons/globus.svg';
import CalendarIcon from '@/shared/assets/icons/calendar.svg';

interface InviteLinksProps {
  workspaceId: string;
}

export const InviteLinks = ({ workspaceId }: InviteLinksProps) => {
  const permanentLink = `https://notion.app/join/acme-abc123`;
  const temporaryLink = `https://notion.app/join/tmp-xyz789`;

  const handleDeleteAction = () => {
    console.log('Delete');
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleBlock}>
        <Typography variant="label" className={styles.sectionTitle}>
          🔒 Ссылки для вступления
        </Typography>
        <div className={styles.info}>Только для администраторов</div>
      </div>

      <div className={styles.links}>
        <InviteLink
          icon={<GlobusIcon className={styles.icon} />}
          label="Постоянная"
          url={temporaryLink}
          onDelete={handleDeleteAction}
        />
        <InviteLink
          icon={<CalendarIcon className={styles.icon} />}
          label="Временная"
          url={permanentLink}
          onDelete={handleDeleteAction}
        />
      </div>
      <Button variant="outline" className={styles.addNewLinkButton}>
        + Создать новую ссылку
      </Button>
    </div>
  );
};
