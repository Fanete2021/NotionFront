import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@shared/ui/Button/Button";
import "@shared/styles/global.css";

const meta = {
    title: "shared/Button",
    component: Button,
    tags: ["autodocs"],
    args: {
        onClick: fn(),
        children: "Нажми на меня",
        variant: "outline",
        size: "sm",
    },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

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

export const ButtonSm: Story = {
    args: {
        size: "sm",
    },
};

export const ButtonMd: Story = {
    args: {
        size: "md",
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
        variant: 'outline',
        disabled: true,
    },
};

export const WithAddon: Story = {
    args: {
        variant: 'filled',
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
