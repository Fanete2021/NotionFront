import styles from './InfoBlock.module.css';
import { Typography } from '@/shared/ui/typography';
import InfoIcon from '@shared/assets/icons/info.svg';

export function InfoBlock() {
  return (
    <div className={styles.info}>
      <InfoIcon className={styles.infoIcon} />
      <Typography variant="caption" className={styles.infoLabel}>
        Изменение роли вступит в силу сразу
      </Typography>
    </div>
  );
}
