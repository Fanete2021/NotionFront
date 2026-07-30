import { SidebarItem } from "@/widgets/Sidebar/model/types/sidebar";
import HomeIcon from "@/shared/assets/icons/home.svg";
import DocsIcon from "@/shared/assets/icons/docs.svg";
import CalendarIcon from "@/shared/assets/icons/calendar.svg";
import TrashIcon from "@/shared/assets/icons/trash-2.svg";
import GearIcon from "@/shared/assets/icons/gear_icon.svg";
import PageIcon from "@/shared/assets/icons/page.svg";

export const sidebarItems: SidebarItem[] = [
    {
        id: "home",
        title: "Главная",
        type: "link",
        href: "/",
        icon: HomeIcon,
    },

    {
        id: "documents",
        title: "Документы",
        type: "link",
        href: "/documents",
        icon: DocsIcon,
    },

    {
        id: "projects",
        title: "Проекты",
        type: "section",
        children: [
            {
                id: "product",
                title: "Продукт",
                type: "group",
                color: "var(--color-project-default)",
                children: [
                    {
                        id: "design-system",
                        title: "Дизайн-система",
                        type: "group",
                        icon: PageIcon,
                        children: [
                            {
                                id: "components",
                                title: "Компоненты",
                                type: "link",
                                href: "/projects/design-system/components",
                            },
                            {
                                id: "colors",
                                title: "Цвета и токены",
                                type: "link",
                                href: "/projects/design-system/colors",
                            },
                        ],
                    },

                    {
                        id: "roadmap",
                        title: "Дорожная карта",
                        type: "link",
                        href: "/projects/roadmap",
                        icon: DocsIcon,
                    },

                    {
                        id: "planning",
                        title: "Планирование Q4",
                        type: "link",
                        href: "/projects/planning",
                        icon: CalendarIcon,
                    },
                ],
            },
            {
                id: "clients",
                title: "Клиенты",
                type: "group",
                color: "green",
            },

            {
                id: "finance",
                title: "Финансы",
                type: "group",
                color: "orange",
            },
        ],
    },

    {
        id: "divider",
        type: "divider",
    },

    {
        id: "calendar",
        title: "Календарь",
        type: "link",
        href: "/calendar",
        icon: CalendarIcon,
    },

    {
        id: "trash",
        title: "Корзина",
        type: "link",
        href: "/trash",
        icon: TrashIcon,
    },

    {
        id: "settings",
        title: "Настройки",
        type: "link",
        href: "/settings",
        icon: GearIcon,
    },
];
