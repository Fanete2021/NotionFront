import common from '../styles/common.module.css';
import styles from './ProfileCard.module.css';
import { ProfileSettings } from '../../model/mock.api';
import { Card } from '@/shared/ui/Card';
import { Avatar } from '@/shared/ui/Avatar';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import CameraIcon from '@/shared/assets/icons/camera.svg';

interface ProfileCardProps {
  firstName: string;
  lastName: string;
  email: string;
  onChange: (patch: Partial<ProfileSettings>) => void;
}

export function ProfileCard({ firstName, lastName, email, onChange }: ProfileCardProps) {
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <Card className={common.card}>
      <div className={styles.identity}>
        <Avatar name={fullName} size="lg" />

        <div className={styles.identityText}>
          <Typography variant="text-regular" className={styles.name}>
            {fullName}
          </Typography>
          <Typography variant="caption" className={styles.email}>
            {email}
          </Typography>
        </div>

        <Button
          className={styles.photoButton}
          variant="outline"
          size="sm"
          addonLeft={<CameraIcon />}
        >
          Изменить фото
        </Button>
      </div>

      <div className={styles.nameRow}>
        <Input
          label="Имя"
          size="m"
          value={firstName}
          onChange={(value) => onChange({ firstName: value })}
        />
        <Input
          label="Фамилия"
          size="m"
          value={lastName}
          onChange={(value) => onChange({ lastName: value })}
        />
      </div>

      <Input
        label="Email адрес"
        type="email"
        size="m"
        value={email}
        onChange={(value) => onChange({ email: value })}
      />
    </Card>
  );
}
