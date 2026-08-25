import type { Meta, StoryObj } from '@storybook/nextjs';
import { SettingsNav } from './SettingsNav';

const meta = {
  title: 'Widgets/settings/SettingsNav',
  component: SettingsNav,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', background: '#ffffff' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SettingsNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ProfileActive: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: '/settings/profile' },
    },
  },
};

export const BillingActive: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: '/settings/billing' },
    },
  },
};

export const NothingActive: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: '/settings' },
    },
  },
};
