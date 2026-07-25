import styles from './Card.module.css';
import classNames from "classnames";

type CardVariant = 'outlined' | 'elevated';

type CardProps = React.ComponentProps<'div'> & {
  variant?: CardVariant;
  selected?: boolean;
}

export const Card = ({
   className,
   variant = 'outlined',
   selected = false,
   children,
   ...props
  }: CardProps) => {
  return (
    <div
      data-variant={variant}
      data-selected={selected ? 'true' : undefined}
      className={classNames(styles.card, className)}
      {...props}
    >
      {children}
    </div>
  )
}
