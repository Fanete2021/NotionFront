import { Control, Controller, useWatch } from 'react-hook-form';
import common from '../common.module.css';
import styles from './ProfileCard.module.css';
import { ProfileSettings } from '../../model/mock.api';
import { Card } from '@/shared/ui/Card';
import { Avatar } from '@/shared/ui/Avatar';
import { Typography } from '@/shared/ui/Typography';
import { Input } from '@/shared/ui/Input';
import { FileInput } from '@/shared/ui/file-input';

interface ProfileCardProps {
  control: Control<ProfileSettings>;
}

export function ProfileCard({ control }: ProfileCardProps) {
  const [firstName, lastName, email, avatarUrl] = useWatch({
    control,
    name: ['firstName', 'lastName', 'email', 'avatarUrl'],
  });

  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <Card className={common.card} radius="m">
      <div className={styles.identity}>
        <Avatar name={fullName} size="lg" src={avatarUrl} />
        <div className={styles.identityText}>
          <Typography variant="text-regular" className={styles.name}>
            {fullName}
          </Typography>
          <Typography variant="caption" className={styles.email}>
            {email}
          </Typography>
        </div>
        <Controller
          name="avatarFile"
          control={control}
          render={({ field, fieldState }) => (
            <FileInput
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              accept="image/png,image/jpeg,image/webp"
              error={fieldState.error?.message}
            />
          )}
        />
      </div>
      <div className={styles.nameRow}>
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              label="Имя"
              size="m"
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              label="Фамилия"
              size="m"
            />
          )}
        />
      </div>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            label="Email адрес"
            type="email"
            size="m"
          />
        )}
      />
    </Card>
  );
}
