import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@shared/ui/Button/Button";
import "@shared/styles/global.css";

const meta = {
    title: "shared/Button", // Наименование компонента, которое будет отображаться в storybook
    component: Button, // Название компонента для которого делается story
    tags: ["autodocs"], // Тег для автоматической документации компонента
    args: {
        // Объект с пропсами компонента
        onClick: fn(),
        children: "Нажми на меня",
        variant: "clear",
        size: "md",
    },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Clear: Story = {
    args: {
        variant: "clear",
    },
};

export const Filled: Story = {
    args: {
        variant: "filled",
    },
};

export const Outline: Story = {
    args: {
        variant: "outline",
    },
};

export const ButtonXss: Story = {
    args: {
        size: "xss",
    },
};

export const ButtonXs: Story = {
    args: {
        size: "xs",
    },
};

export const ButtonS: Story = {
    args: {
        size: "s",
    },
};

export const ButtonMd: Story = {
    args: {
        size: "md",
    },
};

export const ButtonMl: Story = {
    args: {
        size: "ml",
    },
};

export const ButtonLg: Story = {
    args: {
        size: "lg",
    },
};

export const Square: Story = {
    args: {
        square: true,
        variant: "outline",
        children: "📌",
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const WithAddon: Story = {
    args: {
        children: "addon",
        addonLeft: ">",
    },
};

export const FullWidth: Story = {
    args: {
        fullWidth: true,
        variant: "filled",
    },
};
