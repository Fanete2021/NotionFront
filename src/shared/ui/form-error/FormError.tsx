import { Typography } from '@/shared/ui/Typography';
import styles from './FormError.module.css';

interface FormErrorProps {
  message: string | null;
  className?: string;
}

export const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null;
  return (
    <Typography variant="text-regular" className={`${styles.error} ${className || ''}`}>
      {message}
    </Typography>
  );
};
