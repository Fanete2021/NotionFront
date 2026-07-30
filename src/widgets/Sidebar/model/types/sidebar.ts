import { ComponentType, SVGProps } from "react";

export type SidebarItemType = "link" | "group" | "section" | "divider";

export interface SidebarItem {
    id: string;
    title?: string;
    type: SidebarItemType;
    href?: string;
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    color?: string;
    children?: SidebarItem[];
    active?: boolean;
}
