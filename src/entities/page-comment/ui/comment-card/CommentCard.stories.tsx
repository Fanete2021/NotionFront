import type { Meta, StoryObj } from '@storybook/nextjs';
import { CommentCard } from './CommentCard';
import { Button } from '@shared/ui/button';
import '@shared/styles/global.css';

const meta = {
  title: 'entities/CommentCard',
  component: CommentCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 288, padding: 16, background: '#ffffff' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    comment: {
      body: 'Стоит ли добавить пример состояния hover для варианта ghost кнопки?',
      createdAt: new Date(Date.now() - 30 * 60_000).toISOString(),
      authorInfo: { id: '1', name: 'Женя Лебедева', email: 'jenya@example.com', avatarUrl: null },
    },
  },
} satisfies Meta<typeof CommentCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button variant="clear" size="sm">
          Изменить
        </Button>
        <Button variant="clear" size="sm" color="danger">
          Удалить
        </Button>
      </>
    ),
  },
};

export const LongText: Story = {
  args: {
    comment: {
      body: 'Очень длинный комментарий без пробелов: https://example.com/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\nи перенос строки.',
      createdAt: '2026-01-15T10:00:00.000Z',
      authorInfo: { id: '2', name: 'Марк Романов', email: 'mark@example.com', avatarUrl: null },
    },
  },
};
