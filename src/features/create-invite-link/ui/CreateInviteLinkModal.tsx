import styles from './CreateInviteLikModal.module.css';
import { InviteLink } from '../ui/InviteLink/InviteLink';
import { Modal } from '@shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';

export function CreateInviteLinkModal() {
  const isOpen = true;

  const handleClose = () => {};

  const footer = (
    <div className={styles.actions}>
      <Button variant="outline">Отмена</Button>
      <Button variant="filled">Создать ссылку</Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Создать ссылку для вступления"
      footer={footer}
    >
      <Typography variant="text-micro" className={styles.title}>
        ТИП
      </Typography>
      <div className={styles.linksContainer}>
        <InviteLink title="🔗 Постоянная" subtitle="Действует бессрочно" />
        <InviteLink title="⏱ Временная" subtitle="Действует 1 день" />
      </div>
    </Modal>
  );
}
