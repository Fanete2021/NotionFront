import { Button } from '@shared/ui/button';
import GitHub from '@shared/assets/icons/github.svg';

export const OAuthGitHub = () => {
  return (
    <Button variant="filled" addonLeft={<GitHub />} color="github" fullWidth>
      GitHub
    </Button>
  );
};
