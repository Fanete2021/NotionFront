import type { Meta, StoryObj } from '@storybook/nextjs';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'shared/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    borderRadius: { control: 'text' },
    circle: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: '100px',
    height: '20px',
  },
};

export const Circle: Story = {
  args: {
    width: '40px',
    height: '40px',
    circle: true,
  },
};

export const GroupSkeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '240px' }}>
      <Skeleton width="100%" height="32px" borderRadius="6px" />
      <Skeleton width="80%" height="20px" />
      <Skeleton width="60%" height="20px" />
    </div>
  ),
};
