import { SidebarItem } from "@/widgets/Sidebar/model/types/sidebar";
import classNames from "classnames";
import styles from '../SidebarItem.module.css';

export function SidebarIcon({
    icon,
    className,
    onClick,
}: {
    icon?: SidebarItem["icon"];
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
