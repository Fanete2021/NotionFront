import type { Meta, StoryObj } from '@storybook/nextjs';
import { Badge } from './Badge';
import '@/shared/styles/global.css';

const meta = {
  title: 'shared/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    text: 'Verified',
    status: 'verified',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Verified: Story = {};

export const Pending: Story = {
  args: {
    status: 'pending',
    text: 'Pending',
  },
};

export const Failed: Story = {
  args: {
    status: 'failed',
    text: 'Failed',
  },
};

export const New: Story = {
  args: {
    status: 'new',
    text: 'New',
  },
};

export const Draft: Story = {
  args: {
    status: 'draft',
    text: 'Draft',
  },
};

export const Connected: Story = {
  args: {
    status: 'connected',
    text: 'Connected',
  },
};
