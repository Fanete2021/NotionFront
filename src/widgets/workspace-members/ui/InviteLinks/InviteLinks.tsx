import styles from './InviteLinks.module.css';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

interface InviteLinksProps {
  workspaceId: string;
}

export const InviteLinks = ({ workspaceId }: InviteLinksProps) => {
  const permanentLink = `https://notion.app/join/acme-abc123`;
  const temporaryLink = `https://notion.app/join/tmp-xyz789`;

  return (
    <div className={styles.container}>
      <Typography variant="label" className={styles.sectionTitle}>
        Ссылки для вступления
      </Typography>
      <Typography variant="caption" className={styles.note}>
        Только для администраторов
      </Typography>

      <div className={styles.linkRow}>
        <Typography variant="text-regular" className={styles.linkLabel}>
          Постоянная
        </Typography>
        <Typography variant="text-regular" className={styles.linkValue}>
          {permanentLink}
        </Typography>
        <Button variant="outline" size="sm">
          Копировать
        </Button>
      </div>

      <div className={styles.linkRow}>
        <Typography variant="text-regular" className={styles.linkLabel}>
          Временная
        </Typography>
        <Typography variant="text-regular" className={styles.linkValue}>
          {temporaryLink}
        </Typography>
        <Button variant="outline" size="sm">
          Копировать
        </Button>
      </div>
    </div>
  );
};
