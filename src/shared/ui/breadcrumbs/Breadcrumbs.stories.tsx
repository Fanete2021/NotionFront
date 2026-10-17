import type { Meta, StoryObj } from '@storybook/nextjs';
import { Breadcrumbs } from '@shared/ui/breadcrumbs';
import '@shared/styles/global.css';

const meta = {
  title: 'shared/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: {
    items: [{ label: 'Публичная лента', href: '/feed' }, { label: 'Дизайн-система — Компоненты' }],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutLinks: Story = {
  args: {
    items: [{ label: 'Документы' }, { label: 'Дизайн-система' }, { label: 'Компоненты' }],
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Публичная лента' }],
  },
};

export const LongTitle: Story = {
  args: {
    items: [
      { label: 'Публичная лента', href: '/feed' },
      { label: 'Дизайн-система — Основные UI компоненты и принципы их использования' },
    ],
  },
  render: (args) => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <Breadcrumbs {...args} />
    </div>
  ),
};
