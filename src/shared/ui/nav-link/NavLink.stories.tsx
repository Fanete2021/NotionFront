import type { Meta, StoryObj } from '@storybook/nextjs';

import { NavLink } from '@shared/ui/nav-link/NavLink';
import PersonIcon from '@shared/assets/icons/person.svg';
import '@shared/styles/global.css';

const meta = {
  title: 'shared/NavLink',
  component: NavLink,
  tags: ['autodocs'],
  args: {
    href: '/settings/profile',
    children: 'Профиль',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 220, padding: 8, background: '#ffffff' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    active: true,
  },
};

export const WithIcon: Story = {
  args: {
    addonLeft: <PersonIcon />,
  },
};

export const ActiveWithIcon: Story = {
  args: {
    active: true,
    addonLeft: <PersonIcon />,
  },
};

export const Truncated: Story = {
  args: {
    addonLeft: <PersonIcon />,
    children: 'Очень длинное название раздела настроек',
  },
};
