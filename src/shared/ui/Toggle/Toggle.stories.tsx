import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Toggle } from '@/shared/ui/Toggle/Toggle';

const meta = {
    title: 'Toggle',
    component: Toggle,
    tags: ['autodocs'],
    args: {
        onToggle: fn(),
        state: 'off',
    },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
    args: {
        state: 'off',
    },
};

export const On: Story = {
    args: {
        state: 'on',
    },
};

export const OffDisabled: Story = {
    args: {
        state: 'offDisabled',
    },
};

export const OnDisabled: Story = {
    args : {
        state: 'onDisabled',
    },
};
