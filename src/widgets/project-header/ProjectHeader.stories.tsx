import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import { ProjectHeader } from './ProjectHeader';
import '@shared/styles/global.css';

const meta = {
  title: 'Widgets/Projects/ProjectHeader',
  component: ProjectHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onCommentsClick: fn(),
  },
} satisfies Meta<typeof ProjectHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
