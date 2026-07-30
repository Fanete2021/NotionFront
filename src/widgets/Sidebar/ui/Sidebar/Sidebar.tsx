"use client";

import { SidebarItem } from "@/widgets/Sidebar/ui/SidebarItem/SidebarItem";
import { FC } from "react";
import styles from "./Sidebar.module.css";
import classNames from "classnames";
import { Input } from "@/shared/ui/Input";
import SearchIcon from "@/shared/assets/icons/search.svg";
import { Avatar } from "@/shared/ui/Avatar";
import { Typography } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import { sidebarItems } from "@/widgets/Sidebar/ui/Sidebar/test.api";
import PencilIcon from "@/shared/assets/icons/pencil.svg";
import { UserProfile } from "@/widgets/Sidebar/ui/Sidebar/UserProfile/UserProfile";

interface SidebarProps {
    className?: string;
}

export const Sidebar: FC<SidebarProps> = ({ className }) => {
    const sidebarItemsList = sidebarItems;

    const handleSearch = () => {};

    return (
        <aside className={classNames(styles.sidebar, className)}>
            <div className={styles.top}>
                <div className={styles.workspace}>
                    <div className={styles.workspaceLogo}>N</div>

                    <Typography variant="text-medium">
                        Рабочее пространство
                    </Typography>
                    <SearchIcon className={styles.icon} />
                    <PencilIcon className={styles.icon} />
                </div>

                <Input
                    className={styles.searchInput}
                    placeholder="Поиск страниц..."
                    addonLeft={<SearchIcon className={styles.icon} />}
                    addonRight={
                        <div className={styles.inputSymbols}>
                            <Typography
                                variant="text-micro"
                                style={{
                                    backgroundColor: "var(--color-bg-muted)",
                                    padding: "2px 5px",
                                    borderRadius: "4px",
                                }}
                            >
                                ⌘K
                            </Typography>
                        </div>
                    }
                    onChange={handleSearch}
                />

                <nav className={styles.navigation}>
                    {sidebarItemsList.map((item) => (
                        <SidebarItem key={item.id} item={item} />
                    ))}
                </nav>
            </div>

            <UserProfile name="Alex Kim" email="alex@acme.io" />
        </aside>
    );
};
