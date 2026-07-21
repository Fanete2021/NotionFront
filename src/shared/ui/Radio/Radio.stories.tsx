import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Radio } from '@shared/ui/Radio';
import '@shared/styles/global.css';

const meta = {
  title: 'Radio',
  component: Radio,
  tags: ['autodocs'],
  args: { name: 'demo', label: 'Option' },
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  args: {
    label: 'Unselected',
    value: 'unselected'
  },
};

export const Selected: Story = {
  args: {
    label: 'Selected',
    value: 'selected',
    defaultChecked: true
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    value: 'disabled',
    disabled: true
  },
};
