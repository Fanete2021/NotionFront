import type { Meta, StoryObj } from '@storybook/nextjs';
import { LoginPromo } from '@/widgets';
import '@shared/styles/global.css';

const meta = {
  title: 'Widgets/AuthPromo/LoginPromo',
  component: LoginPromo,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 'min(720px, 100vw)',
          minHeight: '100vh',
          margin: '0 auto',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoginPromo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};