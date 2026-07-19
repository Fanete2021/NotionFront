import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from './Checkbox';

const meta = {
  title: 'Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    children: 'Accept terms and conditions',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
  },
};