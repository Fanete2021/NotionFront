import classNames from 'classnames';
import styles from './Card.module.css';

type CardVariant = 'outlined' | 'elevated';
type CardRadius = 'm' | 'l';

type CardProps = React.ComponentProps<'div'> & {
  variant?: CardVariant;
  selected?: boolean;
  radius?: CardRadius;
};

export const Card = ({
  className,
  variant = 'outlined',
  selected = false,
  radius = 'l',
  children,
  ...props
}: CardProps) => {
  return (
    <div
      data-variant={variant}
      data-radius={radius}
      data-selected={selected ? 'true' : undefined}
      className={classNames(styles.card, className)}
      {...props}
    >
      {children}
    </div>
  );
};
