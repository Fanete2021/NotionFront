"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./SidebarItem.module.css";
import { SidebarItem as SidebarItemType } from "../../model/types/sidebar";
import { Button } from "@/shared/ui/Button";
import { usePathname } from "next/navigation";
import { Typography } from "@/shared/ui/Typography";
import ChevronRightIcon from "@/shared/assets/icons/chevron-right-2.svg";
import ChevronDownIcon from "@/shared/assets/icons/chevron-down.svg";
import classNames from "classnames";
import PlusIcon from "@/shared/assets/icons/plus.svg";

interface Props {
    item: SidebarItemType;
    level?: number;
}

export function SidebarItem({ item, level = 0 }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const paddingLeft = 8 + level * 12;

    if (item.type === "divider") {
        return <div className={styles.divider} />;
    }

    if (item.type === "section") {
        return (
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Typography variant="label">{item.title}</Typography>

                    <Button
                        className={styles.plusButton}
                        color="normal"
                        variant="clear"
                    >
                        <SidebarIcon
                            icon={PlusIcon}
                            className={styles.plusIcon}
                        />
                    </Button>
                </div>

                <div>
                    {item.children?.map((child) => (
                        <SidebarItem
                            key={child.id}
                            item={child}
                            level={level}
                        />
                    ))}
                </div>
            </div>
        );
    }

    const hasChildren = item.children && item.children.length > 0;

    const isActive = pathname === item.href;

    if (hasChildren) {
        return (
            <div className={styles.group}>
                <div className={styles.groupHeader} style={{ paddingLeft }}>
                    {isOpen ? (
                        <SidebarIcon
                            icon={ChevronDownIcon}
                            onClick={() => setIsOpen((prev) => !prev)}
                            className={styles.arrow}
                        />
                    ) : (
                        <SidebarIcon
                            icon={ChevronRightIcon}
                            onClick={() => setIsOpen((prev) => !prev)}
                            className={styles.arrow}
                        />
                    )}

                    <SidebarIcon icon={item.icon} />

                    <Typography variant="label">{item.title}</Typography>

                    <Button
                        size="sm"
                        variant="clear"
                        className={styles.moreBtn}
                    >
                        •••
                    </Button>
                </div>

                {isOpen && (
                    <div
                        className={styles.children}
                        style={{ paddingLeft: paddingLeft + 16 }}
                    >
                        {item.children?.map((child) => (
                            <SidebarItem
                                key={child.id}
                                item={child}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={item.href ?? "#"}
            className={`${styles.link} ${isActive ? styles.active : ""}`}
            style={{ paddingLeft }}
        >
            {level > 0 ? <SidebarIcon className={styles.arrow} /> : ""}

            <SidebarIcon icon={item.icon} />

            {item.color && (
                <span
                    className={styles.colorDot}
                    style={{
                        backgroundColor: item.color,
                    }}
                />
            )}

            <Typography variant="label">{item.title}</Typography>
        </Link>
    );
}

function SidebarIcon({
    icon,
    className,
    onClick,
}: {
    icon?: SidebarItemType["icon"];
    className?: string;
    onClick?: () => void;
}) {
    if (!icon) {
        return null;
    }

    const Icon = icon;

    return (
        <Icon
            className={classNames(styles.icon, className)}
            onClick={onClick}
        />
    );
}
