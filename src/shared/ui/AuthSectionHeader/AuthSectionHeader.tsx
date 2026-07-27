import styles from './AuthSectionHeader.module.css';
import {Typography} from "@shared/ui/Typography";

type AuthSectionHeaderVariant = 'promo' | 'form';

interface SectionHeaderProps {
  title: string;
  description: string;
  variant: AuthSectionHeaderVariant;
}

export const AuthSectionHeader = (props: SectionHeaderProps) => {
  const {title, description, variant} = props;

  const titleVariant = variant === 'promo' ? 'h1' : 'h2';

  return (
    <header className={styles.header}>
      <Typography variant={titleVariant}
                  className={styles.title}
      >
        {title}
      </Typography>
      <Typography
        variant='text-regular'
      >
        {description}
      </Typography>
    </header>
  );
};

