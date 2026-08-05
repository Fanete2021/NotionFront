import { SidebarItem as SidebarItemType } from "../../model/types/sidebar";
import { Typography } from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import PlusIcon from "@/shared/assets/icons/plus.svg";
import styles from "./SidebarItem.module.css";
import { SidebarItem } from "./SidebarItem";

interface SidebarSectionProps {
    item: SidebarItemType;
    level: number;
}

export function SidebarSection({ item, level }: SidebarSectionProps) {
    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <Typography className={styles.title} variant="label">
                    {item.title}
                </Typography>

                <Button variant="clear" className={styles.plusButton}>
                    <PlusIcon className={styles.plusIcon} />
                </Button>
            </div>

            {item.children?.map((child) => (
                <SidebarItem key={child.id} item={child} level={level} />
            ))}
        </div>
    );
}
