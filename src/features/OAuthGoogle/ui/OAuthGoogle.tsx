import { Button } from '@shared/ui/Button';
import Globus from '@shared/assets/icons/globus.svg';
import styles from './OAuthGoogle.module.css';

export const OAuthGoogle = () => {
  return (
    <Button
      className={styles.oAuthButton}
      addonLeft={<Globus />}
      variant="outline"
      fullWidth
    >
      Google
    </Button>
  );
};

