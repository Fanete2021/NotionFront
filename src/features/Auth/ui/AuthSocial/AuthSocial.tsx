import styles from './AuthSocial.module.css'
import {Button} from '@shared/ui/Button';
import GitHub from '@shared/assets/icons/github.svg'
import Globus from '@shared/assets/icons/globus.svg'
import classNames from "classnames";

export const AuthSocial = () => {
  return (
    <div className={styles.socialsWrapper}>
      <Button
        className={styles.socialsButton}
        addonLeft={<Globus/>}
        variant='outline'
      >
        Google
      </Button>
      <Button
        className={classNames(styles.socialsButton, styles.gitHubButton)}
        variant='filled'
        addonLeft={<GitHub/>}>
        GitHub
      </Button>
    </div>
  );
};

