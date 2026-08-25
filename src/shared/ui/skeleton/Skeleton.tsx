'use client';

import classNames from 'classnames';
import styles from './Skeleton.module.css';

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  circle?: boolean;
};

export const Skeleton = ({
  width,
  height,
  borderRadius = '4px',
  className,
  circle = false,
}: SkeletonProps) => {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: circle ? '50%' : borderRadius,
  };

  return <div className={classNames(styles.skeleton, className)} style={style} />;
};
