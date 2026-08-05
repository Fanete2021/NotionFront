import { Button } from '@shared/ui/Button';
import Globus from '@shared/assets/icons/globus.svg';

export const OAuthGoogle = () => {
  return (
    <Button addonLeft={<Globus />} variant="outline" fullWidth>
      Google
    </Button>
  );
};
