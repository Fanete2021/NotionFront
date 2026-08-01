import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import { ProjectWorkspace } from './ProjectWorkspace';
import { CommentsSidebar } from '@widgets/comments-sidebar';
import '@shared/styles/global.css';

const meta = {
  title: 'Widgets/Projects/ProjectWorkspace',
  component: ProjectWorkspace,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onCommentsClick: fn(),
    children: (
      <div style={{ padding: '24px 48px' }}>
        <p style={{ margin: 0 }}>Контент документа (заглушка для Storybook)</p>
      </div>
    ),
  },
} satisfies Meta<typeof ProjectWorkspace>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithComments: Story = {
  args: {
    sidebar: <CommentsSidebar onClose={fn()} />,
  },
};
