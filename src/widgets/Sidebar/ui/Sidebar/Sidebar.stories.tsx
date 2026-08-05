import type { Meta, StoryObj } from '@storybook/nextjs';
import { Sidebar } from './Sidebar';

const meta = {
  title: 'Widgets/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          height: '100vh',
          background: '#ffffff',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InsideLayout: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          height: '100vh',
          background: '#f9fafb',
          display: 'flex',
        }}
      >
        <Story />
        <div style={{ flex: 1 }} />
      </div>
    ),
  ],
};
