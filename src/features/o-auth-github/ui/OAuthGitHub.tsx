import { Button } from '@shared/ui/Button';
import GitHub from '@shared/assets/icons/github.svg';

export const OAuthGitHub = () => {
  return (
    <Button
      variant="filled"
      addonLeft={<GitHub />}
      color='github'
      fullWidth
    >
      GitHub
    </Button>
  );
};

