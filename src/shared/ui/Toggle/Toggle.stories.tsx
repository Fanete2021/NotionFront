import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/nextjs";

import { Toggle } from "@/shared/ui/Toggle/Toggle";

const meta = {
    title: "Toggle",
    component: Toggle,
    tags: ["autodocs"],
    args: {
        onToggle: fn(),
        checked: false,
        disabled: false,
    },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
    args: {
        checked: false,
        disabled: false,
    },
};

export const On: Story = {
    args: {
        checked: true,
        disabled: false,
    },
};

export const OffDisabled: Story = {
    args: {
        checked: false,
        disabled: true,
    },
};

export const OnDisabled: Story = {
    args: {
        checked: true,
        disabled: true,
    },
};
