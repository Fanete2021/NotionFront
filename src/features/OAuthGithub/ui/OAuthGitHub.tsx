import classNames from 'classnames';
import { Button } from '@shared/ui/Button';
import GitHub from '@shared/assets/icons/github.svg';
import styles from './OAuthGitHub.module.css';

export const OAuthGitHub = () => {
  return (
    <Button
      className={classNames(styles.oAuthButton, styles.gitHubButton)}
      variant="filled"
      addonLeft={<GitHub />}
      fullWidth
    >
      GitHub
    </Button>
  );
};

