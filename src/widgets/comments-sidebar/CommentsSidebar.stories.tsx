import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import { CommentsSidebar } from './CommentsSidebar';
import '@shared/styles/global.css';

const meta = {
  title: 'Widgets/Projects/CommentsSidebar',
  component: CommentsSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onClose: fn(),
  },
  decorators: [
    (Story) => (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'var(--color-bg-muted)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommentsSidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
