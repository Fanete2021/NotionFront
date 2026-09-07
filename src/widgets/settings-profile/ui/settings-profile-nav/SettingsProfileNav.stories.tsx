import type { Meta, StoryObj } from '@storybook/nextjs';
import { SettingsProfileNav } from './SettingsProfileNav';

const meta = {
  title: 'Widgets/settings-profile/SettingsProfileNav',
  component: SettingsProfileNav,
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
} satisfies Meta<typeof SettingsProfileNav>;

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
