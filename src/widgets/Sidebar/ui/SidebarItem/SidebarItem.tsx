"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./SidebarItem.module.css";
import { SidebarItem as SidebarItemType } from "../../model/types/sidebar";
import { Typography } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import ChevronRightIcon from "@/shared/assets/icons/chevron-right-2.svg";
import ChevronDownIcon from "@/shared/assets/icons/chevron-down.svg";
import PlusIcon from "@/shared/assets/icons/plus.svg";
import { SidebarIcon } from "./SidebarIcon/SidebarIcon";

interface Props {
    item: SidebarItemType;
    level?: number;
}

const BASE_PADDING = 16;
const LEVEL_OFFSET = 8;
const CHILD_LINK_OFFSET = 37;

export function SidebarItem({ item, level = 0 }: Props) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const isActive = pathname === item.href;
    const padding = BASE_PADDING + level * LEVEL_OFFSET;

    if (item.type === "divider") {
        return <div className={styles.divider} />;
    }

    if (item.type === "section") {
        return (
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Typography className={styles.title} variant="label">
                        {item.title}
                    </Typography>

                    <Button variant="clear" className={styles.plusButton}>
                        <SidebarIcon
                            icon={PlusIcon}
                            className={styles.plusIcon}
                        />
                    </Button>
                </div>

                {item.children?.map((child) => (
                    <SidebarItem key={child.id} item={child} level={level} />
                ))}
            </div>
        );
    }

    if (item.type === "group") {
        return (
            <div className={styles.group}>
                <div
                    className={styles.groupHeader}
                    style={{
                        paddingInlineStart: padding,
                    }}
                >
                    <SidebarIcon
                        icon={isOpen ? ChevronDownIcon : ChevronRightIcon}
                        className={styles.arrow}
                        onClick={() => setIsOpen((prev) => !prev)}
                    />

                    {item.icon && <SidebarIcon icon={item.icon} />}

                    {item.color && (
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

                    <Button
                        variant="clear"
                        size="sm"
                        className={styles.moreBtn}
                    >
                        •••
                    </Button>
                </div>

                {isOpen &&
                    item.children?.map((child) => (
                        <SidebarItem
                            key={child.id}
                            item={child}
                            level={level + 1}
                        />
                    ))}
            </div>
        );
    }

    const isDeepChild = level >= 2;

    return (
        <Link
            href={item.href ?? "#"}
            className={`${styles.link} ${isActive ? styles.active : ""}`}
            style={{
                paddingInlineStart: isDeepChild
                    ? padding + CHILD_LINK_OFFSET
                    : padding,
            }}
        >
            {!isDeepChild && level > 0 && (
                <span className={styles.arrowPlaceholder} />
            )}

            {!isDeepChild && item.icon && <SidebarIcon icon={item.icon} />}

            {!isDeepChild && item.color && (
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
