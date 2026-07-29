import type { Meta, StoryObj } from '@storybook/nextjs';
import { RegistrationPanel } from './RegistrationPanel';
import '@shared/styles/global.css';

const meta = {
  title: 'Widgets/AuthPanel/RegistrationPanel',
  component: RegistrationPanel,
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
} satisfies Meta<typeof RegistrationPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};