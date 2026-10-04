import styles from './ErrorBadge.module.css';
import { Badge } from '@shared/ui/badge';

export const ErrorBadge = ({ errorCode }: { errorCode: string }) => {
  return <Badge className={styles.errorBadge} status="new" text={`Ошибка ${errorCode}`} />;
};
