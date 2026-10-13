'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type AvatarProps = React.ComponentPropsWithoutRef<'div'> & {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  fontWeight?: React.CSSProperties['fontWeight'];
};

const getInitials = (name: string, size: AvatarSize) => {
  const trimmedName = name.trim();

  if (!trimmedName.length) {
    return '?';
  }
  const words = trimmedName.split(/\s+/).filter(Boolean);

  let initials = words[0][0];
  if (words.length >= 2) {
    initials = initials + words[1][0];
  }

  const result = initials.toLocaleUpperCase();

  if (size === 'xs') {
    return result[0];
  }

  return result;
};

export const Avatar = (props: AvatarProps) => {
  const { name, src, size = 'md', fontWeight, className, style, ...rest } = props;

  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const imageSrc = src && src !== failedSrc ? src : null;
  const showInitials = !imageSrc || imageSrc !== loadedSrc;

  return (
    <div
      className={classNames(styles.avatar, styles[size], className)}
      style={fontWeight !== undefined ? { ...style, fontWeight } : style}
      {...rest}
    >
      {showInitials && getInitials(name, size)}
      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.image}
          src={imageSrc}
          alt={name}
          referrerPolicy="no-referrer"
          onLoad={() => setLoadedSrc(imageSrc)}
          onError={() => setFailedSrc(imageSrc)}
        />
      )}
    </div>
  );
};
