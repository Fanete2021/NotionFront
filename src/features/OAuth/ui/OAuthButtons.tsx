import styles from './OAuthButtons.module.css';
import {Button} from '@shared/ui/Button';
import GitHub from '@shared/assets/icons/github.svg'
import Globus from '@shared/assets/icons/globus.svg'
import classNames from "classnames";

export const OAuthButtons = () => {
  return (
    <div className={styles.oAuthWrapper}>
      <Button
        className={styles.oAuthButton}
        addonLeft={<Globus/>}
        variant='outline'
        fullWidth
      >
        Google
      </Button>
      <Button
        className={classNames(styles.oAuthButton, styles.gitHubButton)}
        variant='filled'
        addonLeft={<GitHub/>}
        fullWidth
      >
        GitHub
      </Button>
    </div>
  );
};

