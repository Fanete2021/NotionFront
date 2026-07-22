import styles from './Typography.module.css';
import React from "react";
import classNames from "classnames";

const variantMap = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  'text-medium': 'p',
  'text-regular': 'p',
  label: 'label',
  caption: 'span',
  'text-alt': 'p',
  'text-micro': 'label',
  'text-avatar': 'span'
} as const;

type TypographyVariant = keyof typeof variantMap;

export type TypographyProps = React.HTMLAttributes<HTMLElement> & {
  variant?: TypographyVariant;
  children: React.ReactNode;
}

export const Typography = ({
   variant = 'text-regular',
   className,
   children,
   ...props
 }: TypographyProps) => {

  const Comp = variantMap[variant];

  return (
    <Comp className={classNames(className, styles[variant])}
          {...props}
    >
      {children}
    </Comp>
  );
};

Typography.displayName = 'Typography';

