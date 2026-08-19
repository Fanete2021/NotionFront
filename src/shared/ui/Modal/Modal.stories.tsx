import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Modal } from '@shared/ui/Modal';
import { Button } from '@shared/ui/Button';
import { Typography } from '@shared/ui/Typography';
import '@shared/styles/global.css';

const meta = {
  title: 'shared/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    open: true,
    onClose: fn(),
    title: 'Превью модалки',
    subtitle: 'Каркас shared Modal',
    children: (
      <div style={{ padding: '16px 20px 24px' }}>
        <Typography variant="text-regular">Контент body</Typography>
      </div>
    ),
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFooter: Story = {
  render: (args) => (
    <Modal
      {...args}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button type="button" variant="outline" size="sm">
            Отмена
          </Button>
          <Button type="button" variant="filled" size="sm">
            Сохранить
          </Button>
        </div>
      }
    />
  ),
};

export const CustomHeader: Story = {
  args: {
    title: undefined,
    subtitle: undefined,
    header: <Typography variant="text-medium">Свой header</Typography>,
  },
};
