"use client";

import styles from "./Avatar.module.css";
import React from "react";
import classNames from "classnames";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

type AvatarProps = React.ComponentPropsWithoutRef<"div"> & {
  name: string;
  size?: AvatarSize;
  fontWeight?: React.CSSProperties["fontWeight"];
};

const getInitials = (name: string, size: AvatarSize) => {
  const trimmedName = name.trim()

  if (!trimmedName.length) {
    return '?'
  }
  const words = trimmedName.split(/\s+/).filter(Boolean)

  let initials = words[0][0]
  if (words.length >= 2) {
    initials = initials + words[1][0]
  }

  const result = initials.toLocaleUpperCase()

  if (size === "xs") {
    return result[0]
  }

  return result
}

export const Avatar = (props: AvatarProps) => {
  const { name, size = "md", fontWeight, className, style, ...rest } = props;

  return (
    <div
      className={classNames(styles.avatar, styles[size], className)}
      style={fontWeight !== undefined ? { ...style, fontWeight } : style}
      {...rest}
    >
      {getInitials(name, size)}
    </div>
  );
};
