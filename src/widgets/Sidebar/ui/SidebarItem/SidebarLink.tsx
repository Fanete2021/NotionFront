"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Typography } from "@/shared/ui/Typography";

import { SidebarItem as SidebarItemType } from "../../model/types/sidebar";

import styles from "./SidebarItem.module.css";
import { getPadding, getChildPadding, isDeepChild } from "./utils";

interface SidebarLinkProps {
    item: SidebarItemType;
    level: number;
}

export function SidebarLink({ item, level }: SidebarLinkProps) {
    const pathname = usePathname();
    const active = pathname === item.href;
    const deepChild = isDeepChild(level);

    return (
        <Link
            href={item.href ?? "#"}
            className={`${styles.link} ${active ? styles.active : ""}`}
            style={{
                paddingInlineStart: deepChild
                    ? getChildPadding(level)
                    : getPadding(level),
            }}
        >
            {!deepChild && level > 0 && (
                <span className={styles.arrowPlaceholder} />
            )}

            {!deepChild && item.icon && <item.icon className={styles.icon} />}

            {!deepChild && item.color && (
                <span
                    className={styles.colorDot}
                    style={{
                        backgroundColor: item.color,
                    }}
                />
            )}

            <Typography className={styles.title} variant="label">
                {item.title}
            </Typography>
        </Link>
    );
}
