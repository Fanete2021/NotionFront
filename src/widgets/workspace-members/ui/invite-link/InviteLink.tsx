import React from 'react';
import styles from './InviteLink.module.css';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import CopyIcon from '@shared/assets/icons/copy.svg';

interface InviteLinkItemProps {
  icon: React.ReactNode;
  label: string;
  url: string;
  onCopy?: () => void;
  onDelete?: () => void;
}

export const InviteLink = ({ icon, label, url, onCopy, onDelete }: InviteLinkItemProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      onCopy?.();
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      onCopy?.();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.linkBlock}>
          <div className={styles.labelBlock}>
            {icon}
            <Typography variant="text-regular" className={styles.label}>
              {label}
            </Typography>
          </div>
          <div className={styles.urlBlock}>
            <Typography variant="caption" className={styles.url}>
              {url}
            </Typography>
            <Button variant="clear" size="sm" onClick={handleCopy}>
              <CopyIcon className={styles.icon} />
            </Button>
          </div>
        </div>

        <div className={styles.rightBlock}>
          {onDelete && (
            <Button
              className={styles.deleteButton}
              variant="clear"
              size="sm"
              color="danger"
              onClick={onDelete}
            >
              Удалить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
